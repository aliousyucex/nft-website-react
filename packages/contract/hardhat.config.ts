import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  sourcify: {
    // Disabled: Abstract blockchain chains (Testnet: 11124, Mainnet: 2741) may not be supported by Sourcify
    // Sourcify verification will fail if chain is not in their supported list
    // Use explorer verification (etherscan) instead for Abstract blockchain
    enabled: false,
  },
  networks: {
    abstractTestnet: {
      url: process.env.RPC_URL || "https://api.testnet.abs.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11124, // Abstract Testnet Chain ID
    },
    abstractMainnet: {
      url: process.env.RPC_URL_MAINNET || "https://api.abs.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2741, // Abstract Mainnet Chain ID (example, verify actual ID)
    },
  },
  etherscan: {
    // Etherscan API v2: Single API key for all networks
    // Note: Abstract blockchain explorer may not require API key
    // If verification fails, try without API key or check Abstract explorer documentation
    apiKey: process.env.ETHERSCAN_API_KEY || "NO_API_KEY_NEEDED",
    customChains: [
      {
        network: "abstractTestnet",
        chainId: 11124,
        urls: {
          apiURL: "https://api-testnet.abscan.org/api",
          browserURL: "https://testnet.abscan.org",
        },
      },
      {
        network: "abstractMainnet",
        chainId: 2741,
        urls: {
          apiURL: "https://api.abscan.org/api",
          browserURL: "https://abscan.org",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;

