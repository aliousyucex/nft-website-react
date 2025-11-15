import type {Socket} from 'socket.io';
import {SocketErrorCode} from '../../utils/errors';
import logger from '../../utils/logger';

/**
 * Middleware to verify wallet address matches verified address
 * This ensures the user hasn't changed their wallet during the session
 */
export const verifyWalletMiddleware = (socket: Socket, address: string): boolean => {
  // Check if signature was verified
  if (!socket.data.verifiedAddress) {
    logger.warn('Wallet not verified', {
      socketId: socket.id,
      address,
    });
    return false;
  }

  // Check if provided address matches verified address
  const verifiedAddress = socket.data.verifiedAddress.toLowerCase();
  const providedAddress = address.toLowerCase();

  if (verifiedAddress !== providedAddress) {
    logger.warn('Wallet address mismatch', {
      socketId: socket.id,
      verifiedAddress,
      providedAddress,
    });
    return false;
  }

  return true;
};

/**
 * Helper function to check wallet verification and return error callback
 */
export const requireWalletVerification = (
  socket: Socket,
  address: string,
  callback: (response: {success: boolean; error?: string; code?: SocketErrorCode}) => void
): boolean => {
  if (!verifyWalletMiddleware(socket, address)) {
    callback({
      success: false,
      error: 'Wallet not verified or address mismatch. Please reconnect and sign again.',
      code: SocketErrorCode.WALLET_NOT_VERIFIED,
    });
    return false;
  }
  return true;
};

