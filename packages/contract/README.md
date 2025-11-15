# Ice Water Fire - Smart Contract

Solidity smart contract for Ice Water Fire card game on Abstract Chain.

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- npm or yarn
- Wallet with testnet ETH

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your private key
nano .env
```

### Compilation

```bash
# Compile contracts
npm run compile
```

### Testing

```bash
# Run tests
npm test
```

### Deployment

#### Testnet

```bash
# Deploy to Abstract Testnet
npm run deploy:testnet
```

#### Mainnet

```bash
# Deploy to Abstract Mainnet
npm run deploy:mainnet
```

### Verification

```bash
# Verify contract on block explorer
npm run verify -- <CONTRACT_ADDRESS>
```

## 📝 Contract Functions

### User Functions

#### `deposit()`
Deposit ETH to your game balance.
```solidity
function deposit() external payable
```

#### `withdraw(uint256 amount)`
Withdraw ETH from your game balance.
```solidity
function withdraw(uint256 amount) external
```

#### `getWithdrawableUserBalance(address user)`
Get your withdrawable balance.
```solidity
function getWithdrawableUserBalance(address user) external view returns (uint256)
```

### Owner Functions

#### `updateBalance(address user, int256 amount)`
Update a single user's balance (for game payouts).
```solidity
function updateBalance(address user, int256 amount) external onlyOwner
```

#### `updateBalances(address[] users, int256[] amounts)`
Update multiple users' balances in one transaction.
```solidity
function updateBalances(address[] users, int256[] amounts) external onlyOwner
```

#### `withdrawFromContract(address payable to, uint256 amount)`
Withdraw accumulated commission.
```solidity
function withdrawFromContract(address payable to, uint256 amount) external onlyOwner
```

## 🔐 Security Features

- ✅ OpenZeppelin contracts (Ownable, ReentrancyGuard)
- ✅ Owner-only privileged functions
- ✅ Reentrancy protection on withdrawals
- ✅ Balance checks before transfers
- ✅ Negative balance support (debt tracking)
- ✅ Commission accumulation

## 📊 Contract Architecture

```
IceWaterFireGame
├── Ownable (OpenZeppelin)
├── ReentrancyGuard (OpenZeppelin)
├── balances: mapping(address => int256)
└── contractBalance: uint256
```

### Balance System

The contract uses a signed integer (`int256`) for user balances to support:
- **Positive balance**: User has deposited ETH
- **Negative balance**: User owes the contract (bet deductions)
- **Zero balance**: No balance

When a user loses a bet, their balance becomes negative. This is tracked but doesn't allow withdrawal until they deposit more.

### Payout Flow

1. Players ready → Backend deducts bets via `updateBalances` (negative amounts)
2. Game ends → Backend calls `updateBalances` with winner's payout
3. Commission automatically added to `contractBalance`
4. Winner can withdraw their balance

## 🧪 Example Usage

### Player Flow

```javascript
// 1. Deposit 0.1 ETH
await contract.deposit({ value: ethers.parseEther("0.1") });

// 2. Play game (backend handles bet deduction)
// Backend calls: updateBalances([player1, player2], [-0.01, -0.01])

// 3. Win game (backend handles payout)
// Backend calls: updateBalances([winner, loser], [0.0194, -0.01])
// (0.02 pot - 3% commission = 0.0194)

// 4. Withdraw winnings
await contract.withdraw(ethers.parseEther("0.1094"));
```

### Owner Flow

```javascript
// Get withdrawable commission balance (returns Wei)
const commissionWei = await contract.getWithdrawableContractBalance();
// Convert to ETH for display
const commissionEth = ethers.formatEther(commissionWei);
console.log(`Withdrawable commission: ${commissionEth} ETH`);

// Withdraw accumulated commission (amount must be in Wei)
await contract.withdrawFromContract(ownerAddress, commissionWei);
```

### Using Explorer (abscan.org)

#### Reading Contract Balance

1. Go to contract page on explorer
2. Click "Read Contract" tab
3. Find `getWithdrawableContractBalance` function
4. Click "Query" button (no parameters needed)
5. **IMPORTANT**: Result is in Wei. To convert to ETH:
   - Example: `200000000000000000` Wei = 0.2 ETH
   - Divide by 1e18 (1000000000000000000) to get ETH value

#### Withdrawing from Contract

1. Go to contract page on explorer
2. Click "Write Contract" tab
3. Connect your wallet (must be owner)
4. Find `withdrawFromContract` function
5. Enter parameters:
   - `to`: Recipient address (e.g., `0x6c2Ebd1c371cE811e36bfE099e38F37f62410C0b`)
   - `amount`: Amount in **Wei** (e.g., `200000000000000000` for 0.2 ETH)
6. Click "Write" and confirm transaction

**Wei Conversion Examples:**
- 0.001 ETH = `1000000000000000` Wei
- 0.01 ETH = `10000000000000000` Wei
- 0.1 ETH = `100000000000000000` Wei
- 1 ETH = `1000000000000000000` Wei

## 📁 Project Structure

```
contract/
├── contracts/
│   └── IceWaterFireGame.sol    # Main contract
├── scripts/
│   └── deploy.ts                # Deployment script
├── test/
│   └── IceWaterFireGame.test.ts # Tests (TODO)
├── deployments/                 # Deployment artifacts
├── hardhat.config.ts            # Hardhat configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🌐 Networks

### Abstract Testnet
- Chain ID: 11124
- RPC: https://api.testnet.abs.xyz
- Explorer: https://testnet.abscan.org

### Abstract Mainnet
- Chain ID: 2741 (verify actual ID)
- RPC: https://api.abs.xyz
- Explorer: https://abscan.org

## 📝 License

MIT License - see LICENSE file for details.

## ⚠️ Security Notes

1. **Never commit your `.env` file or private keys**
2. **Test thoroughly on testnet before mainnet deployment**
3. **Verify contract source code on block explorer**
4. **Consider getting a security audit for production**

## 🆘 Support

For issues or questions, please open an issue on GitHub.

