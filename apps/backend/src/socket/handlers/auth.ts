import {ethers} from 'ethers';
import type {Server, Socket} from 'socket.io';
import {SocketErrorCode} from '../../utils/errors';
import logger from '../../utils/logger';

export const setupAuthHandlers = (_io: Server, socket: Socket) => {
  /**
   * Verify wallet signature (Session-based authentication)
   * This is called ONCE when user first connects to establish a session
   * The verified address is stored in socket.data and checked on every operation
   * until disconnect/reconnect
   * 
   * Benefits:
   * - Single sign request per session (better UX)
   * - Wallet ownership verification
   * - Prevents wallet switching during session
   * - No need to sign on every deposit/withdraw (they already pay gas)
   */
  socket.on('verify_signature', async (data, callback) => {
    try {
      const {address, signature, message} = data;
      if (!address || !signature || !message) {
        return callback({
          success: false,
          error: 'Missing required fields',
          code: SocketErrorCode.INVALID_SIGNATURE,
        });
      }

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        logger.warn('Signature verification failed', {
          provided: address,
          recovered: recoveredAddress,
        });

        return callback({
          success: false,
          error: 'Signature verification failed',
          code: SocketErrorCode.INVALID_SIGNATURE,
        });
      }

      // Check if message timestamp is recent (within 5 minutes)
      const messageMatch = message.match(/Timestamp: (\d+)/);
      if (messageMatch) {
        const timestamp = parseInt(messageMatch[1]);
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (now - timestamp > fiveMinutes) {
          return callback({
            success: false,
            error: 'Signature expired',
            code: SocketErrorCode.SIGNATURE_EXPIRED,
          });
        }
      }

      // Store verified address and session timestamp in socket data
      socket.data.verifiedAddress = address.toLowerCase();
      socket.data.verifiedAt = Date.now();

      logger.info('Signature verified - Session established', {
        address: address.toLowerCase(),
        socketId: socket.id,
        verifiedAt: socket.data.verifiedAt,
      });

      callback({
        success: true,
        address: address.toLowerCase(),
        message: 'Session established. Wallet verified until disconnect.',
      });
    } catch (error) {
      logger.error('Error verifying signature', error);
      callback({
        success: false,
        error: 'Verification error',
        code: SocketErrorCode.INVALID_SIGNATURE,
      });
    }
  });

  /**
   * Check wallet verification status
   * Useful for frontend to check if wallet is still verified
   */
  socket.on('check_wallet_status', async (data, callback) => {
    try {
      const {address} = data;

      if (!socket.data.verifiedAddress) {
        return callback({
          success: false,
          verified: false,
          error: 'Wallet not verified. Please sign to establish session.',
        });
      }

      const verifiedAddress = socket.data.verifiedAddress.toLowerCase();
      const providedAddress = address?.toLowerCase();

      if (providedAddress && verifiedAddress !== providedAddress) {
        return callback({
          success: false,
          verified: false,
          error: 'Wallet address mismatch. Please reconnect and sign again.',
        });
      }

      callback({
        success: true,
        verified: true,
        address: verifiedAddress,
        verifiedAt: socket.data.verifiedAt,
      });
    } catch (error) {
      logger.error('Error checking wallet status', error);
      callback({
        success: false,
        verified: false,
        error: 'Error checking wallet status',
      });
    }
  });
};
