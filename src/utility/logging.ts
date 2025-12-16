import { createLogger, format, transports } from 'winston'
import { INFO, DEBUG, WARNING, ERROR } from '@tuber/shared'
import { sanitize } from './sanitize'

const inDebugMode = (process.env.NODE_ENV === 'development'
  || process.env.DEBUG === 'true'
)

/**
 * This is the `console.log()` except that a prefix is included and will only
 * output in debug mod.
 */
export const info = (...args: unknown[]): void => {
  if (inDebugMode) {
    args.unshift(INFO)
    console.log(...args)
  }
}

/** Debug mode documenting log. It adds a prefix and outputs to the same line. */
export const task = Object.assign(
  function(message: string): void {
    if (message && inDebugMode) {
      process.stdout.write(`${DEBUG} ${message}`)
    }
  },
  {
    /** A possible outcome of a previous documenting log using `task()` */
    end: (...args: unknown[]): void => log(args)
  }
)

/** This is the `console.log()` but will only print if app is in debug mode. */
export const log = (...args: unknown[]): void => {
  if (inDebugMode) { console.log(...args) }
}

/**
 * This is the `console.log()` except that a prefix is included and will only
 * output in debug mode.
 */
export const dbug = (...args: unknown[]): void => {
  if (inDebugMode) {
    args.unshift(DEBUG)
    console.log(...args)
  }
}

/**
 * Alias for the `log()` function but it should be used in conjunction with
 * `task()` for clarity.
 */
export const task_end = (...args: unknown[]): void => log(args)

/** Log with automatic sanitization of sensitive data. */
export const log_safe = (message: string, data?: unknown, customSensitiveFields?: string[]): void => {
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
export const note = (text: string): void => {
  if (text && inDebugMode) { process.stdout.write(text) }
}

/** 
 * This is the `console.warn()` except that a prefix is included and will only
 * output in debug mode.
 */
export const warn = (...args: unknown[]): void => {
  args.unshift(WARNING)
  if (inDebugMode) { console.warn(...args) }
}

/** This is the `console.error()` but will only print if app is in debug mode. */
export const ler = (...args: unknown[]): void => {
  if (inDebugMode) { console.error(...args) }
}

/** 
 * This is the `console.error()` except that a prefix is included and will only
 * output in debug mode.
 */
export const errr = (...args: unknown[]): void => {
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
export const wstl = (level: string,
  message: string,
  ...meta: unknown[]
): void => {
  logger.log(level, message, ...meta)
}

/** Log errors using winston. */
export const log_err = (message: string, ...meta: unknown[]): void => {
  logger.error(message, ...meta)
}

/** Log errors with automatic sanitization of sensitive data in meta. */
export const log_err_safe = (message: string,
  meta?: unknown,
  customSensitiveFields?: string[]
): void => {
  if (meta !== undefined) {
    const sanitizedMeta = sanitize(meta, customSensitiveFields)
    logger.error(message, sanitizedMeta)
  } else {
    logger.error(message)
  }
}

// Exceptions -----------------------------------------------------------------

export const missing_db_name = (): never => {
  const message = 'Could not read database name from .env files.'
  logger.error(message, { env: process.env.NODE_ENV })
  throw new Error(message)
}

export const missing_db_user = (): never => {
  const message = 'Could not read database username from .env files'
  logger.error(message, { env: process.env.NODE_ENV })
  throw new Error(message)
}