import {getDefaultWallets} from '@rainbow-me/rainbowkit';
import {http, createConfig } from 'wagmi';

// Monad Testnet Chain configuration
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadVision',
      url: 'https://testnet.monadvision.com',
    },
  },
  testnet: true,
};

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

// Get default wallets with recommended wallets (MetaMask, Rainbow, Coinbase Wallet, etc.)
const {connectors} = getDefaultWallets({
  appName: 'ivora',
  projectId,
});

// Create config with Monad Testnet as default chain
export const config = createConfig({
  chains: [monadTestnet],
  connectors,
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: false,
});

export {monadTestnet};
