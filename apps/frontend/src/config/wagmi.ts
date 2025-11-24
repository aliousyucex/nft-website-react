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

// Monad Mainnet Chain configuration
const monadMainnet = {
  id: 143,
  name: 'Monad Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.monad.xyz'],
    },
    public: {
      http: ['https://rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadVision',
      url: 'https://monadvision.com',
    },
  },
  testnet: false,
};

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Get default wallets with recommended wallets (MetaMask, Rainbow, Coinbase Wallet, etc.)
const {connectors} = getDefaultWallets({
  appName: 'ivora',
  projectId,
});

// Create config with Monad Mainnet as default chain
export const config = createConfig({
  chains: [monadMainnet, monadTestnet],
  connectors,
  transports: {
    [monadMainnet.id]: http(),
    [monadTestnet.id]: http(),
  },
  ssr: false,
});

export {monadTestnet, monadMainnet};
