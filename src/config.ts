import NodeCache from 'node-cache'
import { dbGetUrlCredentials, getIp } from './utility'
import Config, { IConfiguration } from './utility/configuration'
import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/../.env` })

const USER_CACHE = new NodeCache({ stdTTL: Number(process.env.STDTTL) || 900 })

/** TODO Configure the app here. */
const USER_CONFIG = {
  // [PROD] Set to false
  /** Whether the app is in debugging mode or not. */
  DEBUG: process.env.DEBUG === 'true', // boolean

  // [PROD] Set to false
  /** Set to `true` when app is actively under development. */
  DEV: process.env.NODE_ENV === 'development',

  /** Application port */
  FASTIFY_PORT: Number(process.env.FASTIFY_PORT) || 8080,

  // [PROD] Change database name to production database name
  /** Mongodb database name. */
  DB_NAME: process.env.DB_NAME || 'db-name-not-set',

  /** Mongo */
  DB_NAME_TEST: process.env.DB_NAME_TEST || `${process.env.DB_NAME}-test`,

  /** Mongodb database port. */
  DB_PORT: Number(process.env.DB_PORT) || 27017,

  // [PROD] Enter Mongodb's production username here
  /** Mongodb database username. */
  DB_USERNAME: process.env.DB_USERNAME || '',

  // [PROD] Enter Mongodb's production password here
  /** Mongodb database password. */
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  // [PROD] Enter Mongodb's production IP address here
  /** In production, it will contain the IP address of the mongodb URL. */
  DB_HOST: process.env.DB_IP_ADDRESS || '',
  // DB_IP_ADDRESS: process.env.DB_IP_ADDRESS || '', // [TODO] Remove this

  /**
   * The cost factor. It controls how much time is needed to calculate a single
   * BCrypt hash.
   *
   * @see https://stackoverflow.com/a/46713082/1875859
   */
  PWD_SALT_ROUNDS: Number(process.env.PWD_SALT_ROUNDS) || 10,

  /** Jwt access token secret */
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'NO_access_token_secret_defined',
  /** Jwt refresh token secret */
  RERESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'NO_refresh_token_secret_defined',
  /**
   * In memory user-caching for request response purposes. Helps alleviate
   * database access.
   */
  USER_CACHE,

  /** The number of notes to return per page. */
  PAGINATION_NOTES_LIMIT: process.env.PAGINATION_NOTES_LIMIT || '10',
  /** The number of users to return per page. */
  PAGINATION_USERS_LIMIT: process.env.PAGINATION_USERS_LIMIT || '10',

  /** Max number of notes pages to load in memory client-side */
  MAX_LOADED_NOTE_PAGES: process.env.MAX_LOADED_NOTE_PAGES || '4',
  /** Max number of users pages to load in memory client-side */
  MAX_LOADED_USER_PAGES: process.env.MAX_LOADED_USER_PAGES || '4',

  /** Database mongoose-paginate-v2 query */
  DB_PAGINATION_QUERY: {
    is_active: true // Only return active documents
                    // When a document is deleted, is_active is set to false
  },

  /** Database mongoose-paginate-v2 options */
  DB_PAGINATION_OPTIONS: {
    // sort: { created_at: -1 } // Comment this out when debugging pagination
  },
}

const credentials = dbGetUrlCredentials(
  USER_CONFIG.DB_USERNAME,
  USER_CONFIG.DB_PASSWORD
)

const DB_URL = [
  'mongodb://',
  credentials,
  getIp(USER_CONFIG.DEBUG, USER_CONFIG.DB_HOST),
  ':',
  USER_CONFIG.DB_PORT,
  '/',
  USER_CONFIG.DEV ? USER_CONFIG.DB_NAME_TEST : USER_CONFIG.DB_NAME
].join('')

const initObj = {
  ...USER_CONFIG,

  /** Default mongodb database development URL. */
  DB_DEV_DEFAULT_URL: 'mongodb://127.0.0.1:27017/test',
  /** Mongodb development and production URL, if all goest well. */
  DB_URL,

  /** This is the `console.log()` but will only print if app is in debug mode. */
  log: function(...args: any) {
    if (USER_CONFIG.DEBUG) {
      console.log(...args)
      // console.log.apply(null, arguments as any)
    }
  },

  /** This is the `console.error()` but will only print if app is in debug mode. */
  err: function(...args: any) {
    if (USER_CONFIG.DEBUG) {
      console.error(...args)
    }
  },

  /** Output to console on the same line. */
  print: function(message: any) {
    if (USER_CONFIG.DEBUG) {
      process.stdout.write(message)
    }
  },

  /** Throw exception and prints message. */
  die: function(message: any) {
    if (USER_CONFIG.DEBUG) {
      throw new Error(message)
    }
  }
}

Config.init(initObj)

// Makes config object key available in suggestions
export type IAppConfig = IConfiguration & typeof initObj

export default Config as IAppConfig
