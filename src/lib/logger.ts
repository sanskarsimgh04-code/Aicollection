/**
 * Centralized Structured Logging Utility
 * Protects against accidental leakage of sensitive tokens, passwords, or personal data.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  module?: string;
  action?: string;
  userId?: string;
  orderId?: string;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'cookie',
  'creditcard',
  'cvv',
  'apikey',
  'anonkey',
  'servicerolekey',
]);

/**
 * Recursively sanitize log data to redact sensitive information
 */
function sanitizeLogData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

class Logger {
  private format(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const cleanContext = context ? sanitizeLogData(context) : undefined;
    return {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(cleanContext ? { context: cleanContext } : {}),
    };
  }

  public debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'production') return;
    const payload = this.format('debug', message, context);
    console.debug(`[DEBUG] ${payload.timestamp} [${context?.module || 'App'}] ${message}`, payload.context || '');
  }

  public info(message: string, context?: LogContext) {
    const payload = this.format('info', message, context);
    console.info(`[INFO] ${payload.timestamp} [${context?.module || 'App'}] ${message}`, payload.context || '');
  }

  public warn(message: string, context?: LogContext) {
    const payload = this.format('warn', message, context);
    console.warn(`[WARN] ${payload.timestamp} [${context?.module || 'App'}] ${message}`, payload.context || '');
  }

  public error(message: string, error?: unknown, context?: LogContext) {
    const errObj = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

    const payload = this.format('error', message, {
      ...context,
      error: errObj,
    });
    console.error(`[ERROR] ${payload.timestamp} [${context?.module || 'App'}] ${message}`, payload.context || '');
  }
}

export const logger = new Logger();
