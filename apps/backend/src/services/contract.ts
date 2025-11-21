import {ethers} from 'ethers';
import config from '../config';
import logger from '../utils/logger';

// Contract ABI will be imported from compiled artifacts
// For now, defining interface
const CONTRACT_ABI = [
  // TODO: Import actual ABI after contract compilation
  'function deposit() external payable',
  'function withdraw(uint256 amount) external',
  'function getWithdrawableUserBalance(address user) external view returns (uint256)',
  'function getUserStats(address user) external view returns (uint256)',
  'function getContractBalance() external view returns (uint256)',
  'function updateBalance(address user, int256 amount) external',
  'function updateBalances(address[] memory users, int256[] memory amounts) external',
  'function getWithdrawableContractBalance() external view returns (uint256)',
  'function withdrawFromContract(address payable to, uint256 amount) external',
  'function getAddressBalance(address user) external view returns (uint256)',
];

export class ContractService {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private wallet: ethers.Wallet | null = null;

  constructor() {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);

    // Initialize wallet (only if private key is provided)
    if (config.blockchain.privateKey) {
      this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);
    }

    // Initialize contract (use wallet if available, otherwise use provider for read-only)
    const contractSigner = this.wallet || this.provider;
    this.contract = new ethers.Contract(
      config.blockchain.contractAddress,
      CONTRACT_ABI,
      contractSigner
    );

    logger.info('Contract service initialized', {
      contractAddress: config.blockchain.contractAddress,
      network: config.blockchain.rpcUrl,
      hasPrivateKey: !!config.blockchain.privateKey,
    });
  }

  /**
   * Get contract statistics
   */
  async getContractStats() {
    try {
      const balance = await this.contract.getContractBalance();
      const withdrawableBalance = await this.contract.getWithdrawableContractBalance();

      return {
        contractAddress: config.blockchain.contractAddress,
        totalBalance: ethers.formatEther(balance),
        withdrawableBalance: ethers.formatEther(withdrawableBalance),
        network: config.blockchain.rpcUrl,
      };
    } catch (error) {
      logger.error('Error getting contract stats:', error);
      throw error;
    }
  }

  /**
   * Get user balance from contract
   */
  async getUserBalance(address: string): Promise<string> {
    try {
      if (!config.blockchain.contractAddress || config.blockchain.contractAddress === '') {
        logger.warn('Contract address not configured, returning 0 balance');
        return '0';
      }

      // Use read-only contract instance for balance queries (more efficient)
      const readOnlyContract = new ethers.Contract(
        config.blockchain.contractAddress,
        CONTRACT_ABI,
        this.provider
      );

      const balance = await readOnlyContract.getWithdrawableUserBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      
      logger.info('User balance retrieved', {
        address,
        balance: formattedBalance,
        contractAddress: config.blockchain.contractAddress,
      });

      return formattedBalance;
    } catch (error) {
      logger.error('Error getting user balance:', {
        error: error instanceof Error ? error.message : error,
        address,
        contractAddress: config.blockchain.contractAddress,
        rpcUrl: config.blockchain.rpcUrl,
      });
      // Return 0 instead of throwing to prevent UI break
      return '0';
    }
  }

  /**
   * Update single user balance (owner only)
   * @param address User wallet address
   * @param amount Amount to add/subtract (in MON, can be negative)
   */
  async updateBalance(address: string, amount: number): Promise<void> {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.contract.updateBalance(address, amountWei);
      await tx.wait();

      logger.info('Balance updated', {address, amount});
    } catch (error) {
      logger.error('Error updating balance:', error);
      throw error;
    }
  }

  /**
   * Update multiple user balances (owner only)
   * Used for game payouts
   */
  async updateBalances(updates: Array<{address: string; amount: number}>): Promise<void> {
    try {
      const addresses = updates.map((u) => u.address);
      const amounts = updates.map((u) => ethers.parseEther(u.amount.toString()));

      const tx = await this.contract.updateBalances(addresses, amounts);
      await tx.wait();

      logger.info('Balances updated', {updates});
    } catch (error) {
      logger.error('Error updating balances:', error);
      throw error;
    }
  }

  /**
   * Calculate commission and winner amount
   */
  calculatePayout(totalPot: number): {commission: number; winnerAmount: number} {
    const commission = totalPot * config.game.commissionRate;
    const winnerAmount = totalPot - commission;

    return {
      commission,
      winnerAmount,
    };
  }

  /**
   * Process game payout
   * @param winnerAddress Winner's address
   * @param loserAddress Loser's address
   * @param betAmount Bet amount per player
   */
  async processGamePayout(
    winnerAddress: string,
    loserAddress: string,
    betAmount: number
  ): Promise<void> {
    try {
      const totalPot = betAmount * 2;
      const {commission, winnerAmount} = this.calculatePayout(totalPot);

      // Update balances: winner gets prize
      await this.updateBalance(winnerAddress, winnerAmount);

      logger.info('Game payout processed', {
        winner: winnerAddress,
        loser: loserAddress,
        winnerAmount,
        commission,
      });
    } catch (error) {
      logger.error('Error processing game payout:', error);
      throw error;
    }
  }

  /**
   * Process disconnect payout
   */
  async processDisconnectPayout(
    remainingAddress: string,
    disconnectedAddress: string,
    betAmount: number,
    remainingPlayerAhead: boolean
  ): Promise<void> {
    try {
      if (remainingPlayerAhead) {
        // Remaining player ahead: gets 60% of pot
        const totalPot = betAmount * 2;
        const prize = totalPot * 0.6;

        await this.updateBalances([
          {address: remainingAddress, amount: prize},
          {address: disconnectedAddress, amount: -betAmount},
        ]);
      } else {
        // Remaining player equal/behind: gets refund, disconnected loses bet
        await this.updateBalances([
          {address: remainingAddress, amount: betAmount},
          {address: disconnectedAddress, amount: -betAmount},
        ]);
      }

      logger.info('Disconnect payout processed', {
        remaining: remainingAddress,
        disconnected: disconnectedAddress,
        ahead: remainingPlayerAhead,
      });
    } catch (error) {
      logger.error('Error processing disconnect payout:', error);
      throw error;
    }
  }

  /**
   * Process AFK forfeit payout with conditional logic
   * @param opponentAddress Active player's address
   * @param afkAddress AFK player's address
   * @param betAmount Bet amount per player
   * @param opponentIsAhead Whether opponent has higher score
   */
  async processAfkForfeitPayout(
    opponentAddress: string,
    afkAddress: string,
    betAmount: number,
    opponentIsAhead: boolean
  ): Promise<void> {
    try {
      if (opponentIsAhead) {
        // Opponent was ahead: gets 60% of pot, 40% stays in contract
        const totalPot = betAmount * 2;
        const prize = totalPot * 0.6;

        await this.updateBalance(opponentAddress, prize);

        logger.info('AFK forfeit payout - opponent ahead, 60% payout', {
          opponent: opponentAddress,
          afkPlayer: afkAddress,
          prize,
          betAmount,
        });
      } else {
        // Opponent not ahead: Just refund the not afk player
        await this.updateBalance(opponentAddress, betAmount);

        logger.info('AFK forfeit - opponent not ahead, bets refunded', {
          opponent: opponentAddress,
          afkPlayer: afkAddress,
          refundAmount: betAmount,
        });
      }
    } catch (error) {
      logger.error('Error processing AFK forfeit payout:', error);
      throw error;
    }
  }

  /**
   * Refund both players their bets
   */
  async refundBothPlayers(
    player1Address: string,
    player2Address: string,
    betAmount: number
  ): Promise<void> {
    try {
      await this.updateBalances([
        {address: player1Address, amount: betAmount},
        {address: player2Address, amount: betAmount},
      ]);

      logger.info('Both players refunded', {
        player1: player1Address,
        player2: player2Address,
        refundAmount: betAmount,
      });
    } catch (error) {
      logger.error('Error refunding both players:', error);
      throw error;
    }
  }

  /**
   * Verify contract is accessible
   */
  async verifyContract(): Promise<boolean> {
    try {
      await this.contract.getContractBalance();
      return true;
    } catch (error) {
      logger.error('Contract verification failed:', error);
      return false;
    }
  }
}

export default new ContractService();
