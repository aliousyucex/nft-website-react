export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

// Socket.IO error codes
export enum SocketErrorCode {
  ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
  ROOM_FULL = 'ROOM_FULL',
  ROOM_PASSWORD_REQUIRED = 'ROOM_PASSWORD_REQUIRED',
  ROOM_PASSWORD_INCORRECT = 'ROOM_PASSWORD_INCORRECT',
  NOT_IN_ROOM = 'NOT_IN_ROOM',
  GAME_NOT_PLAYING = 'GAME_NOT_PLAYING',
  GAME_ALREADY_STARTED = 'GAME_ALREADY_STARTED',
  INVALID_CARD = 'INVALID_CARD',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  SIGNATURE_EXPIRED = 'SIGNATURE_EXPIRED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_BET_AMOUNT = 'INVALID_BET_AMOUNT',
  BANNED = 'BANNED',
}
