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
export function error(...args: unknown[]): void {
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
export function log_err(...args: unknown[]): void {
  logger.error(args.map(String).join(' '));
}
