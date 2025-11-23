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
      metadata: {
        bytecodeHash: "none", // disable ipfs - required for Monad verification
        useLiteralContent: true, // use source code - required for Monad verification
      },
    },
  },
  sourcify: {
    // Enabled for Monad Testnet (MonadVision)
    // Disabled for Abstract blockchain chains (Testnet: 11124, Mainnet: 2741) - not supported by Sourcify
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadvision.com",
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
    monadTestnet: {
      url: "https://testnet-rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10143, // Monad Testnet Chain ID
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
      {
        network: "monadTestnet",
        chainId: 10143,
        urls: {
          apiURL: "https://api.socialscan.io/monad-testnet/v1/explorer/command_api/contract",
          browserURL: "https://socialscan.xyz",
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

