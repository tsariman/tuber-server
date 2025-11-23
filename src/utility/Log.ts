import { INFO, DEBUG, WARNING, ERROR } from '@tuber/shared'

const inDebugMode = (process.env.NODE_ENV === 'development'
  || process.env.DEBUG === 'true'
)

/** Unified Logging method class */
export default class L {
  static info = (...args: unknown[]): void => {
    if (inDebugMode) {
      args.unshift(INFO)
      console.log(...args)
    }
  }
  static og = (...args: unknown[]): void => {
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
  static er = (...args: unknown[]): void => {
    if (inDebugMode) {
      args.unshift(ERROR)
      console.error(...args)
    }
  }
  static task = Object.assign(
    function(message: string): void {
      if (message && inDebugMode) {
        process.stdout.write(`${DEBUG} ${message}`)
      }
    },
    {
      /** A possible outcome of a previous documenting log using `task()` */
      end: (...args: unknown[]): void => this.og(args)
    }
  )
  static note = (text: string): void => {
    if (text && inDebugMode) { process.stdout.write(text) }
  }
}