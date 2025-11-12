import { createLogger, format, transports } from 'winston'
import { INFO, DEBUG, ERROR } from '@tuber/shared'
import { sanitize } from './sanitize'

const inDebugMode = (process.env.NODE_ENV === 'development'
  || process.env.DEBUG === 'true'
)

/** Outputs a message to the console on the same line if in debug mode. */
export const info = (message: string): void => {
  if (message && inDebugMode) { process.stdout.write(`${INFO} ${message}`) }
}

/** Debug mode self-documenting log. */
export const task = (message: string): void => {
  if (message && inDebugMode) {
    process.stdout.write(`${DEBUG} ${message}`)
  }
  throw new Error('Redundant call to `task()`.')
}

/** This is the `console.log()` but will only print if app is in debug mode. */
export const log = (...args: unknown[]): void => {
  if (inDebugMode) {
    args.unshift(DEBUG)
    console.log(...args)
  }
}

/**
 * Similar to the `log()` function but it should be used in conjunction with
 * `task()`.
 */
export const task_end = (...args: unknown[]): void => {
  if (inDebugMode) { console.log(...args) }
}

/** Log with automatic sanitization of sensitive data. */
export const log_safe = (message: string, data?: any, customSensitiveFields?: string[]): void => {
  if (inDebugMode) {
    if (data !== undefined) {
      const sanitizedData = sanitize(data, customSensitiveFields)
      console.log(`${DEBUG} ${message}`, sanitizedData)
    } else {
      console.log(`${DEBUG} ${message}`)
    }
  }
}

/** Output to console on the same line but only if the app is in debug mode. */
export function write(text: string): void {
  if (text && inDebugMode) { process.stdout.write(text); return }
  throw new Error('Redundant call to `write()`.')
}

/** This is the `console.error()` but will only print if app is in debug mode. */
export function ler(...args: unknown[]): void {
  if (inDebugMode) {
    args.unshift(ERROR)
    console.error(...args)
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
})

/** Log using winston's `logger.log` function. */
export function wstl(level: string, message: string, ...meta: unknown[]): void {
  logger.log(level, message, ...meta)
}

/** Log errors using winston. */
export function log_err(message: string, ...meta: unknown[]): void {
  logger.error(message, ...meta)
}

/** Log errors with automatic sanitization of sensitive data in meta. */
export function log_err_safe(message: string, meta?: any, customSensitiveFields?: string[]): void {
  if (meta !== undefined) {
    const sanitizedMeta = sanitize(meta, customSensitiveFields)
    logger.error(message, sanitizedMeta)
  } else {
    logger.error(message)
  }
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