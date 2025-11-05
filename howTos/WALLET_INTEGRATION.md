# Abstract Chain Wallet Integration

Complete wallet integration using Wagmi + RainbowKit for Abstract Chain.

## 🎯 Features

- ✅ **Abstract Testnet Support**: Chain ID 11124 (0x2B74)
- ✅ **RainbowKit UI**: Beautiful wallet connection modal
- ✅ **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase, etc.
- ✅ **Auto-Connect**: Automatic reconnection on page reload
- ✅ **Network Switching**: One-click network change
- ✅ **Custom Styling**: Branded connect button

## 📦 Dependencies

```json
{
  "@rainbow-me/rainbowkit": "^2.0.0",
  "@tanstack/react-query": "^5.28.0",
  "viem": "^2.7.0",
  "wagmi": "^2.5.0"
}
```

## 🔧 Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

### 3. Configure Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_CONTRACT_ADDRESS=0x... # After contract deployment
VITE_CHAIN_ID=0x2B74
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 4. Add Abstract Testnet to MetaMask

**Option A: Automatic (when connecting)**
- RainbowKit will prompt to add the network automatically

**Option B: Manual**

Open MetaMask → Settings → Networks → Add Network → Add a network manually:

```
Network Name: Abstract Testnet
RPC URL: https://api.testnet.abs.xyz
Chain ID: 11124
Currency Symbol: ETH
Block Explorer: https://testnet.abscan.org
```

## 🎮 Usage

### Basic Usage

The game automatically prompts for wallet connection:

```tsx
// Navigate to /game
// If wallet not connected, shows wallet prompt
// If connected, shows game lobby
```

### Manual Wallet Connection

Use the `WalletConnect` component anywhere:

```tsx
import WalletConnect from './components/wallet/WalletConnect';

function MyComponent() {
  return (
    <div>
      <WalletConnect />
    </div>
  );
}
```

### Access Wallet Data

```tsx
import { useAccount, useBalance } from 'wagmi';

function MyComponent() {
  const { address, isConnected, isDisconnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (isDisconnected) {
    return <div>Please connect wallet</div>;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.formatted} ETH</p>
    </div>
  );
}
```

### Sign Messages

```tsx
import { useSignMessage } from 'wagmi';

function MyComponent() {
  const { signMessage } = useSignMessage();

  const handleSign = async () => {
    const message = `Sign in to Ice Water Fire\nTimestamp: ${Date.now()}`;
    const signature = await signMessage({ message });
    console.log('Signature:', signature);
  };

  return <button onClick={handleSign}>Sign Message</button>;
}
```

### Read Contract

```tsx
import { useReadContract } from 'wagmi';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const ABI = [...]; // Your contract ABI

function MyComponent() {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getWithdrawableUserBalance',
    args: [userAddress],
  });

  return <div>Balance: {data}</div>;
}
```

### Write Contract

```tsx
import { useWriteContract } from 'wagmi';

function MyComponent() {
  const { writeContract } = useWriteContract();

  const handleDeposit = async () => {
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'deposit',
      value: parseEther('0.01'),
    });
  };

  return <button onClick={handleDeposit}>Deposit 0.01 ETH</button>;
}
```

## 🎨 Customization

### Change Theme

Edit `config/wagmi.ts`:

```ts
export const config = getDefaultConfig({
  appName: 'Your App Name',
  projectId: '...',
  chains: [abstractTestnet],
  // Add theme
  theme: {
    lightMode: {
      accentColor: '#667eea',
      accentColorForeground: 'white',
    },
    darkMode: {
      accentColor: '#764ba2',
      accentColorForeground: 'white',
    },
  },
});
```

### Custom Connect Button

Edit `components/wallet/WalletConnect.tsx` to match your design:

```tsx
<ConnectWalletButton onClick={openConnectModal}>
  Your Custom Design
</ConnectWalletButton>
```

## 🔒 Security

### Message Signing

Always include timestamp in signed messages:

```typescript
const message = `
Action: Login to Ice Water Fire
Address: ${address}
Timestamp: ${Date.now()}
Nonce: ${randomNonce}
`;
```

### Transaction Confirmation

Always show transaction details before confirming:

```tsx
const handleTransaction = async () => {
  // Show modal with transaction details
  const confirmed = await confirmModal({
    to: CONTRACT_ADDRESS,
    function: 'deposit',
    value: '0.01 ETH',
  });

  if (confirmed) {
    await writeContract({ ... });
  }
};
```

## 🐛 Troubleshooting

### "Unsupported Chain" Error

**Solution:** User needs to switch to Abstract Testnet
```tsx
import { useSwitchChain } from 'wagmi';

const { switchChain } = useSwitchChain();

// Prompt user to switch
await switchChain({ chainId: 11124 });
```

### RPC Errors

**Solution:** Check RPC URL in config:
```ts
rpcUrls: {
  default: { http: ['https://api.testnet.abs.xyz'] },
}
```

### Balance Not Updating

**Solution:** Use `refetch` or set `watch: true`:
```tsx
const { data, refetch } = useBalance({ 
  address,
  watch: true, // Auto-refresh
});
```

### WalletConnect Not Working

**Solution:** Verify Project ID:
```ts
projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
```

## 📚 Resources

- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://www.rainbowkit.com)
- [Viem Docs](https://viem.sh)
- [Abstract Chain Docs](https://docs.abs.xyz)

## 🚀 Production Checklist

- [ ] Update RPC URL for mainnet
- [ ] Change Chain ID to mainnet
- [ ] Update CONTRACT_ADDRESS
- [ ] Add Sentry/error tracking
- [ ] Test with multiple wallets
- [ ] Add network fallback
- [ ] Implement transaction retry logic
- [ ] Add loading states
- [ ] Handle transaction errors gracefully

## 🔄 Migration from Solana

Old (Solana):
```tsx
import { useWallet } from '@solana/wallet-adapter-react';

const { publicKey, connected } = useWallet();
```

New (Abstract/EVM):
```tsx
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();
```

## 📝 Notes

- Abstract Chain is EVM-compatible (same as Ethereum)
- Use `ethers.js` or `viem` for contract interactions
- Gas fees paid in ETH
- Chain ID: 11124 (testnet), TBD (mainnet)
- Supports all EVM wallets (MetaMask, Coinbase, etc.)

## 🆘 Support

For issues:
1. Check console for errors
2. Verify network configuration
3. Check RPC URL is accessible
4. Ensure wallet has testnet ETH
5. Open an issue on GitHub

