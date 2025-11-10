import { createLogger, format, transports } from 'winston'
import { DEBUG, ERROR } from '@tuber/shared'

const inDevMode = (process.env.NODE_ENV === 'development')

export const L = {
  start: (text: string) => {
    if (inDevMode) { process.stdout.write(`${DEBUG} ${text}`) }
  },
  end: (...args: unknown[]) => { if (inDevMode) { console.log(...args) } },
  er: (...args: unknown[]) => { if (inDevMode) { console.log(...args) } },
  ug: (...args: unknown[]) => { if (inDevMode) { console.log(...args) } }
}

/** This is the `console.log()` but will only print if app is in debug mode. */
export function log(...args: unknown[]): void {
  if (inDevMode) { console.log(...args) }
}

/** Output to console on the same line but only if the app is in debug mode. */
export function write(text: string): void {
  if (text && inDevMode) { process.stdout.write(text); return }
  throw new Error('Redundant call to `write()`.')
}

/** Log an error message to the console if app is in debug mode. */
export function ler_start(...args: unknown[]) {
  if (inDevMode) {
    args.unshift(ERROR)
    console.error(...args)
  }
}

/** This is the `console.error()` but will only print if app is in debug mode. */
export function ler(...args: unknown[]): void {
  if (inDevMode) { console.error(...args) }
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
})

/** Log using winston's `logger.log` function. */
export function wstl(level: string, message: string, ...meta: unknown[]): void {
  logger.log(level, message, ...meta)
}

/** Log errors using winston. */
export function log_err(message: string, ...meta: unknown[]): void {
  logger.error(message, ...meta)
}

// Exceptions -----------------------------------------------------------------

export function missing_db_name(): never {
  const message = 'Could not read database name from .env files.'
  logger.error(message, { env: process.env.NODE_ENV })
  throw new Error(message)
}

export function missing_db_user(): never {
  const message = 'Could not read database username from .env files'
  logger.error(message, { env: process.env.NODE_ENV })
  throw new Error(message)
}