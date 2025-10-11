import { Server, Socket } from 'socket.io';
import { ethers } from 'ethers';
import logger from '../../utils/logger';
import { SocketErrorCode } from '../../utils/errors';

export const setupAuthHandlers = (io: Server, socket: Socket) => {
  /**
   * Verify wallet signature
   * This is called before player joins a room to verify they own the wallet
   */
  socket.on('verify_signature', async (data, callback) => {
    try {
      const { address, signature, message } = data;

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

      // Store verified address in socket data
      socket.data.verifiedAddress = address.toLowerCase();

      logger.info('Signature verified', { address, socketId: socket.id });

      callback({
        success: true,
        address: address.toLowerCase(),
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
};

