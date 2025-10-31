import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {http} from 'wagmi';

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

export const config = getDefaultConfig({
  appName: 'Ice Water Fire',
  projectId: VITE_WALLETCONNECT_PROJECT_ID || '4fa1d964ec5302ec1801f47c61b39b7d',
  chains: [abstractTestnet],
  transports: {
    [abstractTestnet.id]: http(),
  },
  ssr: false,
});

export {abstractTestnet, abstractMainnet};
