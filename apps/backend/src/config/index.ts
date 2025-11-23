import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: number;
    nodeEnv: string;
  };
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  security: {
    apiSecretKey: string;
  };
  blockchain: {
    contractAddress: string;
    rpcUrl: string;
    privateKey: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    banDurationMs: number;
  };
  socket: {
    pingTimeout: number;
    pingInterval: number;
  };
  game: {
    cardSelectionTimeout: number;
    disconnectGracePeriod: number;
    maxRoundLimit: number;
    commissionRate: number;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/game',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_this_secret_in_production',
    expiresIn: '2h',
  },
  security: {
    apiSecretKey: process.env.API_SECRET_KEY || 'change_this_api_secret',
  },
  blockchain: {
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    rpcUrl: process.env.RPC_URL || 'https://testnet-rpc.monad.xyz',
    privateKey: process.env.PRIVATE_KEY || '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    banDurationMs: parseInt(process.env.RATE_LIMIT_BAN_DURATION_MS || '3600000', 10),
  },
  socket: {
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || '10000', 10),
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10),
  },
  game: {
    cardSelectionTimeout: parseInt(process.env.CARD_SELECTION_TIMEOUT || '10000', 10), // 10 seconds
    disconnectGracePeriod: parseInt(process.env.DISCONNECT_GRACE_PERIOD || '10000', 10),
    maxRoundLimit: parseInt(process.env.MAX_ROUND_LIMIT || '15', 10),
    commissionRate: parseFloat(process.env.COMMISSION_RATE || '0.03'),
  },
};

// Validation
if (config.server.nodeEnv === 'production') {
  if (!config.blockchain.contractAddress) {
    throw new Error('CONTRACT_ADDRESS is required in production');
  }
  if (!config.blockchain.privateKey) {
    throw new Error('PRIVATE_KEY is required in production');
  }
  if (config.jwt.secret === 'change_this_secret_in_production') {
    throw new Error('JWT_SECRET must be changed in production');
  }
}

export default config;
