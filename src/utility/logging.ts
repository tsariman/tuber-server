import { createLogger, format, transports } from 'winston';

/** This is the `console.log()` but will only print if app is in debug mode. */
export function log(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

/** Output to console on the same line but only if the app is in debug mode. */
export function write(text: string): void {
  if (text && process.env.NODE_ENV === 'development') {
    process.stdout.write(text);
    return;
  } else if (!text) {
    throw new Error('Redundant call to `write()`.');
  }
}

/** This is the `console.error()` but will only print if app is in debug mode. */
export function ler(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
});

/** Log using winston's `logger.log` function. */
export function l(level: string, message: string, ...meta: unknown[]): void {
  logger.log(level, message, ...meta);
}

/** Log errors using winston. */
export function log_err(message: string, ...meta: unknown[]): void {
  logger.error(message, ...meta);
}

// Exceptions -----------------------------------------------------------------

export function missing_db_name(): never {
  const message = 'Could not read database name from .env files.';
  logger.error(message, { env: process.env.NODE_ENV });
  throw new Error(message);
}

export function missing_db_user(): never {
  const message = 'Could not read database username from .env files';
  logger.error(message, { env: process.env.NODE_ENV });
  throw new Error(message);
}