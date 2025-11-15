import {abstractWalletConnector} from '@abstract-foundation/agw-react/connectors';
import {http, createConfig } from 'wagmi';
import {coinbaseWallet, injected, walletConnect} from 'wagmi/connectors';

// Abstract Chain configuration
const abstractTestnet = {
  id: 11124,
  name: 'Abstract Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
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
    name: 'Ether',
    symbol: 'ETH',
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

// Create config with Abstract connector and standard connectors
// We use getDefaultConfig for RainbowKit compatibility, but we need to manually add Abstract connector
// Since getDefaultConfig returns a config object (not config params), we create a new config
export const config = createConfig({
  chains: [abstractTestnet],
  connectors: [
    // Add Abstract connector first (so it appears first in wallet selection)
    abstractWalletConnector(),
    // Standard connectors (same as getDefaultConfig would add)
    injected(),
    coinbaseWallet({appName: 'Ice Water Fire'}),
    walletConnect({projectId}),
  ],
  transports: {
    [abstractTestnet.id]: http(),
  },
  ssr: false,
});

export {abstractTestnet, abstractMainnet};
