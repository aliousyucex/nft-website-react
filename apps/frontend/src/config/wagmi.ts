import {abstractWalletConnector} from '@abstract-foundation/agw-react/connectors';
import {http, createConfig } from 'wagmi';
import {coinbaseWallet, injected, walletConnect} from 'wagmi/connectors';

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

// Abstract Chain configuration (kept for reference)
const abstractTestnet = {
  id: 11124,
  name: 'Abstract Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.abs.xyz'],
    },
    public: {
      http: ['https://api.testnet.abs.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Abstract Explorer',
      url: 'https://sepolia.abscan.org/',
    },
  },
  testnet: true,
};

const abstractMainnet = {
  id: 2741, // Update with actual mainnet chain ID
  name: 'Abstract',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://api.abs.xyz'],
    },
    public: {
      http: ['https://api.abs.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Abstract Explorer',
      url: 'https://abscan.org',
    },
  },
  testnet: false,
};

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

// Create config with Monad Testnet as default chain
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    // Standard connectors
    injected(),
    coinbaseWallet({appName: 'Ice Water Fire'}),
    walletConnect({projectId}),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: false,
});

export {monadTestnet, abstractTestnet, abstractMainnet};
