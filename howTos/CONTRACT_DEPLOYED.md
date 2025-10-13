# 🎉 Contract Successfully Deployed!

## 📍 Deployment Information

### Abstract Testnet Deployment

```json
{
  "network": "abstract-testnet",
  "chainId": "11124",
  "contractAddress": "0x3A895aeA91388f6b44227CDb565FDb04a8A81C79",
  "owner": "0x6c2Ebd1c371cE811e36bfE099e38F37f62410C0b",
  "deployedAt": "2025-10-11T05:51:58.000Z",
  "transactionHash": "0x839281ae1922dd42078d854e4dc2658f1324073ae5a4fdd8d0aaaac371b1e377"
}
```

## 🔗 Links

- **Contract Address:** [0x3A895aeA91388f6b44227CDb565FDb04a8A81C79](https://explorer.testnet.abs.xyz/address/0x3A895aeA91388f6b44227CDb565FDb04a8A81C79)
- **Transaction:** [0x839281ae...](https://explorer.testnet.abs.xyz/tx/0x839281ae1922dd42078d854e4dc2658f1324073ae5a4fdd8d0aaaac371b1e377)
- **Owner:** [0x6c2Ebd1c371cE811e36bfE099e38F37f62410C0b](https://explorer.testnet.abs.xyz/address/0x6c2Ebd1c371cE811e36bfE099e38F37f62410C0b)

## ⚙️ Setup Instructions

### 1. Backend Configuration

Create `backend/.env` file:

```bash
cd backend
cp env.example .env
```

Update `backend/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/iwf_game

# JWT & Security
JWT_SECRET=your_jwt_secret_change_in_production_min_32_chars_here
API_SECRET_KEY=your_api_secret_key_change_in_production_here

# Blockchain (Abstract Chain Testnet)
CONTRACT_ADDRESS=0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
RPC_URL=https://api.testnet.abs.xyz
PRIVATE_KEY=your_private_key_without_0x_prefix_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_BAN_DURATION_MS=3600000

# WebSocket
SOCKET_PING_TIMEOUT=10000
SOCKET_PING_INTERVAL=25000

# Game Settings
CARD_SELECTION_TIMEOUT=5000
DISCONNECT_GRACE_PERIOD=10000
MAX_ROUND_LIMIT=15
COMMISSION_RATE=0.03
```

### 2. Frontend Configuration

Create `frontend/.env` file:

```bash
cd frontend
cp env.example .env
```

Update `frontend/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
VITE_CHAIN_ID=0x2b74
VITE_RPC_URL=https://api.testnet.abs.xyz

# WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 3. Docker Configuration

Update `docker-compose.yml` (already configured):

```yaml
environment:
  CONTRACT_ADDRESS=0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
```

Create `.env` in root directory:

```env
# Blockchain
CONTRACT_ADDRESS=0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
RPC_URL=https://api.testnet.abs.xyz
CHAIN_ID=0x2b74

# Backend
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/iwf_game
JWT_SECRET=your_jwt_secret_here
API_SECRET_KEY=your_api_secret_here
PRIVATE_KEY=your_private_key_here

# Frontend
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 🧪 Test Contract

### Using Hardhat Console

```bash
cd contract
npx hardhat console --network abstractTestnet
```

```javascript
const contractAddress = "0x3A895aeA91388f6b44227CDb565FDb04a8A81C79";
const IWF = await ethers.getContractAt("IceWaterFireGame", contractAddress);

// Get owner
const owner = await IWF.owner();
console.log("Owner:", owner);

// Check balance
const balance = await IWF.getBalance("0x6c2Ebd1c371cE811e36bfE099e38F37f62410C0b");
console.log("Balance:", ethers.formatEther(balance), "ETH");
```

### Using Script

```bash
cd contract
npx hardhat run scripts/test-deployment.ts --network abstractTestnet
```

## 🚀 Start Services

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run at: http://localhost:5000

### 2. Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will run at: http://localhost:5173

### 3. Test Full Stack

1. Open browser: http://localhost:5173/game
2. Connect wallet (MetaMask)
3. Switch to Abstract Testnet
4. Create a room or join existing room
5. Place bet and play!

## 🐛 Fixed Issues

### ✅ BigInt Serialization Error

**Problem:**
```
TypeError: Do not know how to serialize a BigInt
at JSON.stringify (<anonymous>)
```

**Solution:**
```typescript
// Before
chainId: (await ethers.provider.getNetwork()).chainId

// After
chainId: network.chainId.toString() // Convert BigInt to string
```

**Status:** Fixed in `contract/scripts/deploy.ts`

## 📝 Contract Functions

### Read Functions

```solidity
function owner() external view returns (address)
function getBalance(address user) external view returns (uint256)
```

### Write Functions

```solidity
function deposit() external payable
function withdraw(uint256 amount) external
function updateBalances(address winner, address loser, uint256 betAmount, uint256 commission) external
```

## 🔐 Security Notes

- ✅ Contract owner: 0x6c2Ebd1c371cE811e36bfE099e38F37f62410C0b
- ✅ Only owner can call `updateBalances`
- ✅ Users can only withdraw their own balance
- ✅ Commission deducted before balance update

## 📊 Next Steps

1. ✅ Contract deployed successfully
2. ✅ BigInt serialization fixed
3. ⏳ Create backend `.env` file
4. ⏳ Create frontend `.env` file
5. ⏳ Get WalletConnect Project ID
6. ⏳ Setup PostgreSQL database
7. ⏳ Start backend server
8. ⏳ Test full game flow

## 🆘 Troubleshooting

### View Contract on Explorer

```
https://explorer.testnet.abs.xyz/address/0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
```

### Verify Contract (Optional)

```bash
cd contract
npx hardhat verify --network abstractTestnet 0x3A895aeA91388f6b44227CDb565FDb04a8A81C79
```

### Re-deploy (if needed)

```bash
cd contract
npm run deploy:testnet
```

**Note:** New deployment will create a different address. Update all `.env` files!

---

**Deployment Date:** October 11, 2025
**Status:** ✅ Successfully Deployed
**Network:** Abstract Testnet (Chain ID: 11124)

