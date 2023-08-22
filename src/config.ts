import { dbGetUrlCredentials, getIp } from './utility'
import Config, { IConfiguration } from './utility/configuration'

/** TODO Configure the app here. */
const USER_CONFIG = {
  // [PROD] Set to false
  /** Whether the app is in debugging mode or not. */
  DEBUG: true, // boolean

  // [PROD] Set to true
  /** If `true`, app will be in production mode. */
  PRODUCTION: false, // boolean

  // [PROD] Set to false
  /** Set to `true` when app is actively under development. */
  DEV: true,

  // [PROD] Change database name to production database name
  /** Mongodb database name. */
  DB_NAME: 'tuber-dev',

  /** Mongodb database port. */
  PORT: 27017,

  // [PROD] Enter Mongodb's production username here
  /** Mongodb database username. */
  DB_USERNAME: '',

  // [PROD] Enter Mongodb's production password here
  /** Mongodb database password. */
  DB_PASSWORD: '',

  // [PROD] Enter Mongodb's production IP address here
  /** In production, it will contain the IP address of the mongodb URL. */
  DB_IP_ADDRESS: '',

  /**
   * The cost factor. It controls how much time is needed to calculate a single
   * BCrypt hash.
   *
   * @see https://stackoverflow.com/a/46713082/1875859
   */
  PWD_SALT_ROUNDS: 10
}

const credentials = dbGetUrlCredentials(
  USER_CONFIG.DB_USERNAME,
  USER_CONFIG.DB_PASSWORD
)

const DB_URL = [
  'mongodb://',
  credentials,
  getIp(USER_CONFIG.DEBUG, USER_CONFIG.DB_IP_ADDRESS),
  ':',
  USER_CONFIG.PORT,
  '/',
  USER_CONFIG.DB_NAME
].join('')

const initObj = {
  ...USER_CONFIG,

  /** Default mongodb database development URL. */
  DB_DEV_DEFAULT_URL: 'mongodb://127.0.0.1:27017/test',
  /** Mongodb development and production URL, if all goest well. */
  DB_URL,

  /** This is the `console.log()` but will only print if app is in debug mode. */
  log: (whatever: any) => {
    if (USER_CONFIG.DEBUG) {
      console.log(whatever)
    }
  },

  /** This is the `console.error()` but will only print if app is in debug mode. */
  err: (whatever: any) => {
    if (USER_CONFIG.DEBUG) {
      console.error(whatever)
    }
  }
}

Config.init(initObj)

// Makes config object key available in suggestions
export type IAppConfig = IConfiguration & typeof initObj

export default Config as IAppConfig
