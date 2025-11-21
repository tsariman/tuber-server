import { INFO, DEBUG, WARNING, ERROR } from '@tuber/shared'

const inDebugMode = (process.env.NODE_ENV === 'development'
  || process.env.DEBUG === 'true'
)

export default class Log {
  static info = (...args: unknown[]): void => {
    if (inDebugMode) {
      args.unshift(INFO)
      console.log(...args)
    }
  }
  static dbug = (...args: unknown[]): void => {
    if (inDebugMode) {
      args.unshift(DEBUG)
      console.log(...args)
    }
  }
  static warn = (...args: unknown[]): void => {
    if (inDebugMode) {
      args.unshift(WARNING)
      console.warn(...args)
    }
  }
  static errr = (...args: unknown[]): void => {
    if (inDebugMode) {
      args.unshift(ERROR)
      console.error(...args)
    }
  }
}