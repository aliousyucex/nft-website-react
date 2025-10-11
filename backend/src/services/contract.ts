import { ethers } from 'ethers';
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
  private wallet: ethers.Wallet;

  constructor() {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);

    // Initialize wallet
    this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);

    // Initialize contract
    this.contract = new ethers.Contract(
      config.blockchain.contractAddress,
      CONTRACT_ABI,
      this.wallet
    );

    logger.info('Contract service initialized', {
      contractAddress: config.blockchain.contractAddress,
      network: config.blockchain.rpcUrl,
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
      const balance = await this.contract.getWithdrawableUserBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error('Error getting user balance:', error);
      throw error;
    }
  }

  /**
   * Update single user balance (owner only)
   * @param address User wallet address
   * @param amount Amount to add/subtract (in ETH, can be negative)
   */
  async updateBalance(address: string, amount: number): Promise<void> {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.contract.updateBalance(address, amountWei);
      await tx.wait();

      logger.info('Balance updated', { address, amount });
    } catch (error) {
      logger.error('Error updating balance:', error);
      throw error;
    }
  }

  /**
   * Update multiple user balances (owner only)
   * Used for game payouts
   */
  async updateBalances(
    updates: Array<{ address: string; amount: number }>
  ): Promise<void> {
    try {
      const addresses = updates.map((u) => u.address);
      const amounts = updates.map((u) => ethers.parseEther(u.amount.toString()));

      const tx = await this.contract.updateBalances(addresses, amounts);
      await tx.wait();

      logger.info('Balances updated', { updates });
    } catch (error) {
      logger.error('Error updating balances:', error);
      throw error;
    }
  }

  /**
   * Calculate commission and winner amount
   */
  calculatePayout(totalPot: number): { commission: number; winnerAmount: number } {
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
      const { commission, winnerAmount } = this.calculatePayout(totalPot);

      // Update balances: winner gets prize, loser loses bet
      await this.updateBalances([
        { address: winnerAddress, amount: winnerAmount },
        { address: loserAddress, amount: -betAmount },
      ]);

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
          { address: remainingAddress, amount: prize },
          { address: disconnectedAddress, amount: -betAmount },
        ]);
      } else {
        // Remaining player equal/behind: gets refund, disconnected loses bet
        await this.updateBalances([
          { address: remainingAddress, amount: betAmount },
          { address: disconnectedAddress, amount: -betAmount },
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
   * Process both players disconnected
   */
  async processBothDisconnected(
    player1Address: string,
    player2Address: string,
    betAmount: number
  ): Promise<void> {
    try {
      // Both lose their bets
      await this.updateBalances([
        { address: player1Address, amount: -betAmount },
        { address: player2Address, amount: -betAmount },
      ]);

      logger.info('Both players disconnected - bets forfeited', {
        player1: player1Address,
        player2: player2Address,
      });
    } catch (error) {
      logger.error('Error processing both disconnected:', error);
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

