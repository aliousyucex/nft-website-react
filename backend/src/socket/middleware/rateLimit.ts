import { Socket } from 'socket.io';
import config from '../../config';
import logger from '../../utils/logger';
import { db } from '../../db/connection';

// In-memory rate limiting (for socket connections)
const ipRateLimits = new Map<string, { count: number; lastReset: number; bannedUntil: number | null }>();
const addressRateLimits = new Map<string, { count: number; lastReset: number; bannedUntil: number | null }>();

export const rateLimitMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  const ip = socket.handshake.address;
  const now = Date.now();

  try {
    // Check IP-based rate limit
    let ipData = ipRateLimits.get(ip) || { count: 0, lastReset: now, bannedUntil: null };

    // Check if IP is banned
    if (ipData.bannedUntil && now < ipData.bannedUntil) {
      const remainingTime = Math.ceil((ipData.bannedUntil - now) / 1000 / 60);
      logger.warn('Banned IP attempted connection', { ip, remainingTime });
      return next(new Error(`This IP is banned for ${remainingTime} more minutes`));
    }

    // Reset count if window passed
    if (now - ipData.lastReset > config.rateLimit.windowMs) {
      ipData.count = 0;
      ipData.lastReset = now;
      ipData.bannedUntil = null;
    }

    ipData.count++;

    // Check if exceeded limit
    if (ipData.count > config.rateLimit.maxRequests) {
      ipData.bannedUntil = now + config.rateLimit.banDurationMs;
      ipRateLimits.set(ip, ipData);

      // Save to database
      await db
        .insertInto('ban_list')
        .values({
          ip_address: ip,
          banned_until: new Date(ipData.bannedUntil),
          reason: 'Rate limit exceeded',
        })
        .execute();

      logger.warn('IP banned for rate limit', { ip });
      return next(new Error('Rate limit exceeded. Banned for 1 hour'));
    }

    ipRateLimits.set(ip, ipData);

    logger.debug('Rate limit check passed', { ip, count: ipData.count });
    next();
  } catch (error) {
    logger.error('Rate limit middleware error', { error });
    next();
  }
};

/**
 * Check address-based rate limit
 */
export const checkAddressRateLimit = (address: string): boolean => {
  const now = Date.now();
  let addressData = addressRateLimits.get(address) || { 
    count: 0, 
    lastReset: now, 
    bannedUntil: null 
  };

  // Check if banned
  if (addressData.bannedUntil && now < addressData.bannedUntil) {
    return false;
  }

  // Reset if window passed
  if (now - addressData.lastReset > config.rateLimit.windowMs) {
    addressData.count = 0;
    addressData.lastReset = now;
    addressData.bannedUntil = null;
  }

  addressData.count++;

  // Check limit
  if (addressData.count > config.rateLimit.maxRequests) {
    addressData.bannedUntil = now + config.rateLimit.banDurationMs;
    addressRateLimits.set(address, addressData);

    // Save to database
    db.insertInto('ban_list')
      .values({
        wallet_address: address,
        banned_until: new Date(addressData.bannedUntil),
        reason: 'Rate limit exceeded',
      })
      .execute()
      .catch((err) => logger.error('Error saving address ban', err));

    return false;
  }

  addressRateLimits.set(address, addressData);
  return true;
};

/**
 * Cleanup expired bans (run periodically)
 */
export const cleanupExpiredBans = async () => {
  try {
    await db
      .deleteFrom('ban_list')
      .where('banned_until', '<', new Date())
      .execute();

    logger.info('Cleaned up expired bans');
  } catch (error) {
    logger.error('Error cleaning up bans', error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredBans, 60 * 60 * 1000);

