import {ValidationError} from './errors';

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateAddress = (address: string): void => {
  if (!address || !isValidEthereumAddress(address)) {
    throw new ValidationError('Invalid Ethereum address');
  }
};

export const validateBetAmount = (amount: number): void => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new ValidationError('Bet amount must be a number');
  }
  if (amount < 0) {
    throw new ValidationError('Bet amount cannot be negative');
  }
  // Allow 0 for free/practice games
  if (amount > 0 && amount < 0.001) {
    throw new ValidationError('Minimum bet amount is 0.001 ETH (or 0 for free games)');
  }
  if (amount > 1000) {
    throw new ValidationError('Maximum bet amount is 1000 ETH');
  }
};

export const validateRoomPassword = (password: string | undefined): void => {
  if (password !== undefined) {
    if (typeof password !== 'string') {
      throw new ValidationError('Password must be a string');
    }
    if (password.length > 8) {
      throw new ValidationError('Password maximum length is 8 characters');
    }
  }
};

export const validateWinningScore = (score: number | undefined): void => {
  if (score !== undefined) {
    if (typeof score !== 'number' || Number.isNaN(score)) {
      throw new ValidationError('Winning score must be a number');
    }
    if (score < 1 || score > 10) {
      throw new ValidationError('Winning score must be between 1 and 10');
    }
  }
};

export const validateRoomId = (roomId: string): void => {
  if (!roomId || typeof roomId !== 'string') {
    throw new ValidationError('Invalid room ID');
  }
  if (roomId.length !== 8) {
    throw new ValidationError('Room ID must be 8 characters');
  }
};

export const validateCardSelection = (cardId: string): void => {
  if (!cardId || typeof cardId !== 'string') {
    throw new ValidationError('Invalid card ID');
  }
  const validCards = [
    'fire_3',
    'fire_5',
    'fire_7',
    'ice_3',
    'ice_5',
    'ice_7',
    'water_3',
    'water_5',
    'water_7',
  ];
  if (!validCards.includes(cardId)) {
    throw new ValidationError('Invalid card');
  }
};

export const validatePagination = (page: number, limit: number): void => {
  if (page < 1) {
    throw new ValidationError('Page must be greater than 0');
  }
  if (limit < 1 || limit > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }
};
