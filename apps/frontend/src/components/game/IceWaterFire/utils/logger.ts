/**
 * Conditional logging utility for development and production
 * Only shows critical errors in production, all logs in development
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Socket-related logs (only in development)
   */
  socket: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`🔌 [SOCKET] ${message}`, data || '');
    }
  },

  /**
   * Game logic logs (only in development)
   */
  game: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`🎮 [GAME] ${message}`, data || '');
    }
  },

  /**
   * UI/Component logs (only in development)
   */
  ui: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`🎨 [UI] ${message}`, data || '');
    }
  },

  /**
   * Timer/Round logs (only in development)
   */
  timer: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`⏱️ [TIMER] ${message}`, data || '');
    }
  },

  /**
   * Animation logs (only in development)
   */
  animation: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`✨ [ANIMATION] ${message}`, data || '');
    }
  },

  /**
   * Info messages (always shown)
   */
  info: (message: string, data?: unknown) => {
    console.info(`ℹ️ [INFO] ${message}`, data || '');
  },

  /**
   * Warning messages (always shown)
   */
  warn: (message: string, data?: unknown) => {
    console.warn(`⚠️ [WARNING] ${message}`, data || '');
  },

  /**
   * Error messages (always shown)
   */
  error: (message: string, error?: unknown) => {
    console.error(`❌ [ERROR] ${message}`, error || '');
  },

  /**
   * Success messages (only in development)
   */
  success: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`✅ [SUCCESS] ${message}`, data || '');
    }
  },
};

/**
 * Debug helper - logs object in a formatted way
 */
export const debugObject = (label: string, obj: unknown) => {
  if (isDev) {
    console.group(`🔍 DEBUG: ${label}`);
    console.table(obj);
    console.groupEnd();
  }
};

/**
 * Performance timer
 */
export const perfTimer = (label: string) => {
  if (!isDev) return {end: () => {}};

  const start = performance.now();

  return {
    end: () => {
      const duration = (performance.now() - start).toFixed(2);
      console.log(`⚡ [PERF] ${label}: ${duration}ms`);
    },
  };
};

export default logger;
