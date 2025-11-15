// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Ivora
 * @dev Smart contract for Ice Water Fire card game
 * @notice Manages user balances and payouts for the game
 */
contract Ivora is Ownable, ReentrancyGuard {
    // Address to balance mapping
    mapping(address => int256) private balances;
    
    // Contract balance (commission accumulation)
    uint256 private contractBalance;

    // Events
    event Deposit(address indexed user, uint256 amount, int256 newBalance);
    event Withdrawal(address indexed user, uint256 amount, int256 newBalance);
    event BalanceUpdated(address indexed user, int256 amount, int256 newBalance);
    event BalancesUpdated(address[] users, int256[] amounts);
    event ContractWithdrawal(address indexed to, uint256 amount);

    /**
     * @dev Constructor - sets the deployer as owner
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Deposit ETH to user balance
     * @dev Updates user balance and contract balance
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        balances[msg.sender] += int256(msg.value);
        contractBalance += msg.value;

        emit Deposit(msg.sender, msg.value, balances[msg.sender]);
    }

    /**
     * @notice Withdraw ETH from user balance
     * @param amount Amount to withdraw in wei
     * @dev User must have sufficient positive balance
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= int256(amount), "Insufficient balance");
        require(contractBalance >= amount, "Contract has insufficient funds");

        balances[msg.sender] -= int256(amount);
        contractBalance -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(msg.sender, amount, balances[msg.sender]);
    }

    /**
     * @notice Get withdrawable balance for a user
     * @param user User address
     * @return Withdrawable balance (returns 0 if negative)
     */
    function getWithdrawableUserBalance(address user) external view returns (uint256) {
        if (balances[user] <= 0) {
            return 0;
        }
        return uint256(balances[user]);
    }

    /**
     * @notice Get user stats (alias for getWithdrawableUserBalance)
     * @param user User address
     * @return User balance
     */
    function getUserStats(address user) external view returns (uint256) {
        if (balances[user] <= 0) {
            return 0;
        }
        return uint256(balances[user]);
    }

    /**
     * @notice Get total contract balance
     * @return Contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return contractBalance;
    }

    /**
     * @notice Update balance for a single user (owner only)
     * @param user User address
     * @param amount Amount to add (can be negative)
     * @dev Used for game payouts and penalties
     */
    function updateBalance(address user, int256 amount) external onlyOwner {
        balances[user] += amount;

        // If amount is negative (penalty/bet), add to contract balance
        if (amount < 0) {
            contractBalance += uint256(-amount);
        }

        emit BalanceUpdated(user, amount, balances[user]);
    }

    /**
     * @notice Update balances for multiple users (owner only)
     * @param users Array of user addresses
     * @param amounts Array of amounts (can be negative)
     * @dev Used for game payouts - must have equal length arrays
     */
    function updateBalances(address[] calldata users, int256[] calldata amounts) external onlyOwner {
        require(users.length == amounts.length, "Arrays must have equal length");
        require(users.length > 0, "Arrays cannot be empty");

        for (uint256 i = 0; i < users.length; i++) {
            balances[users[i]] += amounts[i];

            // If amount is negative (penalty/bet), add to contract balance
            if (amounts[i] < 0) {
                contractBalance += uint256(-amounts[i]);
            } else if (amounts[i] > 0) {
                // If amount is positive (payout), ensure contract has funds
                require(contractBalance >= uint256(amounts[i]), "Insufficient contract funds");
                contractBalance -= uint256(amounts[i]);
            }

            emit BalanceUpdated(users[i], amounts[i], balances[users[i]]);
        }

        emit BalancesUpdated(users, amounts);
    }

    /**
     * @notice Get withdrawable contract balance (owner only)
     * @return Withdrawable balance in wei
     * @dev Returns accumulated commission balance that can be withdrawn by owner
     * @notice IMPORTANT: Returns value in Wei. To convert to ETH, divide by 1e18
     * @notice Example: 200000000000000000 Wei = 0.2 ETH
     */
    function getWithdrawableContractBalance() external view onlyOwner returns (uint256) {
        return contractBalance;
    }

    /**
     * @notice Withdraw from contract balance (owner only)
     * @param to Recipient address
     * @param amount Amount to withdraw in wei
     * @dev Withdraws accumulated commission
     * @notice IMPORTANT: Amount must be in Wei (1 ETH = 1000000000000000000 Wei)
     */
    function withdrawFromContract(address payable to, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(contractBalance >= amount, "Insufficient contract balance");
        require(to != address(0), "Invalid recipient address");
        // Additional safety check: ensure contract has enough ETH balance
        require(address(this).balance >= amount, "Contract ETH balance insufficient");

        contractBalance -= amount;

        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");

        emit ContractWithdrawal(to, amount);
    }

    /**
     * @notice Get address balance (owner only)
     * @param user User address
     * @return User balance (can be negative)
     * @dev Returns actual balance including negative values
     */
    function getAddressBalance(address user) external view onlyOwner returns (int256) {
        return balances[user];
    }

    /**
     * @notice Fallback function to receive ETH
     */
    receive() external payable {
        contractBalance += msg.value;
    }

    /**
     * @notice Get contract's actual ETH balance
     * @return ETH balance
     */
    function getEthBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

