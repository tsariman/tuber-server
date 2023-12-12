import NodeCache from 'node-cache'
import * as dotenv from 'dotenv'
import { dbGetUrlCredentials, get_ip } from './utility'
import Config, { IConfiguration } from './utility/configuration'

dotenv.config({ path: `${__dirname}/../.env.app-config` })

interface IConfig {
  NODE_ENV: string
  DEV: boolean
  DEBUG: boolean
  DOMAIN: string
  DEMO: boolean
  FASTIFY_PORT: number
  IMAGE_FOLDER: string
  DB_REMOTE: boolean
  DB_PROTOCOL: string
  DB_PROD_NAME: string
  DB_DEV_NAME: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_HOST: string
  DB_PORT: string
  DB_URI_QUERYSTRING: string
  DB_ATLAS_API_PUBLIC_KEY: string
  DB_ATLAS_API_PRIVATE_KEY: string
  DB_ATLAS_PROJECT_ID: string
  DB_ATLAS_CLUSTER_NAME: string
  DB_ATLAS_API_BASE_URL: string
  DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME: string
  PWD_SALT_ROUNDS: number
  PAGINATION_BOOKMARKS_LIMIT: string
  PAGINATION_USERS_LIMIT: string
  MAX_LOADED_BOOKMARK_PAGES: string
  MAX_LOADED_USER_PAGES: string
  DEFAULT_THEME_MODE: 'light' |  'dark'
}

/** TODO Configure the app here. */
const USER_CONFIG: IConfig = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DEV: process.env.NODE_ENV === 'development',

  // [PROD] Set to false
  /** Whether the app is in debugging mode or not. */
  DEBUG: process.env.NODE_ENV === 'development'
    || process.env.DEBUG === 'true', // boolean
  
  DOMAIN: process.env.DOMAIN ?? '',
  DEMO: process.env.DEMO === 'true',

  /** Application port */
  FASTIFY_PORT: Number(process.env.FASTIFY_PORT) || 8080,

  IMAGE_FOLDER: process.env.IMAGE_FOLDER || '',

  /** Mongodb database location. */
  DB_REMOTE: process.env.DB_REMOTE === 'true',

  /** Mongodb database protocol. */
  DB_PROTOCOL: process.env.DB_PROTOCOL || 'mongodb://',

  /** Mongodb production database name. */
  DB_PROD_NAME: process.env.DB_NAME || 'db-name-not-set',

  /** Mongodb development database name */
  DB_DEV_NAME: process.env.DB_TEST_NAME || `${process.env.DB_PROD_NAME}-test`,

  // [PROD] Enter Mongodb's production username here
  /** Mongodb database username. */
  DB_USERNAME: process.env.DB_USERNAME ?? '',

  // [PROD] Enter Mongodb's production password here
  /** Mongodb database password. */
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',

  /** The domain name or the IP address of the mongodb URL. */
  DB_HOST: process.env.DB_HOST ?? '127.0.0.1',

  /** Mongodb database port. */
  DB_PORT: process.env.DB_PORT ?? '', // 27017

  DB_URI_QUERYSTRING: process.env.DB_URI_QUERYSTRING ?? '',

  /** @see https://youtu.be/Z05rVI5mhzE?si=zAKs8NByVUvxdo03&t=464 */
  DB_ATLAS_API_PUBLIC_KEY: process.env.DB_ATLAS_API_PUBLIC_KEY ?? '',
  /** @see https://youtu.be/Z05rVI5mhzE?si=zAKs8NByVUvxdo03&t=464 */
  DB_ATLAS_API_PRIVATE_KEY: process.env.DB_ATLAS_API_PRIVATE_KEY ?? '',

  DB_ATLAS_PROJECT_ID: process.env.DB_ATLAS_PROJECT_ID ?? '',
  DB_ATLAS_CLUSTER_NAME: process.env.DB_ATLAS_CLUSTER_NAME ?? '',

  DB_ATLAS_API_BASE_URL: process.env.DB_ATLAS_API_BASE_URL ?? '',
  /**
   * The bookmark search index is defined in the MongoDB Atlas cloud using
   * api keys.
   */
  DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME:
    process.env.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME
    ?? ''
  ,

  /**
   * The cost factor. It controls how much time is needed to calculate a single
   * BCrypt hash.
   *
   * @see https://stackoverflow.com/a/46713082/1875859
   */
  PWD_SALT_ROUNDS: Number(process.env.PWD_SALT_ROUNDS) || 10,

  /** The number of bookmarks to return per page. */
  PAGINATION_BOOKMARKS_LIMIT: process.env.PAGINATION_BOOKMARKS_LIMIT || '10',
  /** The number of users to return per page. */
  PAGINATION_USERS_LIMIT: process.env.PAGINATION_USERS_LIMIT || '10',

  /** Max number of bookmarks pages to load in memory client-side */
  MAX_LOADED_BOOKMARK_PAGES: process.env.MAX_LOADED_BOOKMARK_PAGES || '4',
  /** Max number of users pages to load in memory client-side */
  MAX_LOADED_USER_PAGES: process.env.MAX_LOADED_USER_PAGES || '4',
  /** Current theme mode */
  DEFAULT_THEME_MODE: 'dark',
}

interface IGenericObject { [key: string]: any }

const USER_CACHE = new NodeCache({ stdTTL: Number(process.env.STDTTL) || 900 })
const STATE_REGISTRY: IGenericObject = {}

const initObj = {
  ...USER_CONFIG,

  /**
   * In memory user-caching for request response purposes. Helps alleviate
   * database access.
   */
  USER_CACHE,

  /** Default mongodb database development URL. */
  DB_DEV_DEFAULT_URL: `mongodb://127.0.0.1:27017/${USER_CONFIG.DB_DEV_NAME}`,

  /** Database name */
  DB_NAME: USER_CONFIG.DEV ? USER_CONFIG.DB_DEV_NAME : USER_CONFIG.DB_PROD_NAME,

  /** Mongodb development and production URI, if all goes well. */
  DB_URI_REMOTE: [
    USER_CONFIG.DB_PROTOCOL,
    dbGetUrlCredentials(USER_CONFIG.DB_USERNAME, USER_CONFIG.DB_PASSWORD),
    get_ip(USER_CONFIG.DEBUG, USER_CONFIG.DB_HOST),
    USER_CONFIG.DB_PORT ? `:${USER_CONFIG.DB_PORT}` : '',
    '/',
    USER_CONFIG.DEV ? USER_CONFIG.DB_DEV_NAME : USER_CONFIG.DB_PROD_NAME,
    USER_CONFIG.DB_URI_QUERYSTRING ? `?${USER_CONFIG.DB_URI_QUERYSTRING}` : ''
  ].join(''),

  /**
   * Use to connect to local database e.g.  
   * `mongodb://127.0.0.1:27017/db_dev_name-test`
   */
  DB_URI_LOCAL: [
    `mongodb://`,
    // credentials,
    get_ip(USER_CONFIG.DEBUG, USER_CONFIG.DB_HOST),
    /*PORT*/ USER_CONFIG.DB_PORT ? `:${USER_CONFIG.DB_PORT}` : ':27017',
    '/',
    USER_CONFIG.DB_DEV_NAME,
  ].join(''),

  /** Mongodb Atlas API URL */
  DB_ATLAS_CLUSTER_API_URL: [
    USER_CONFIG.DB_ATLAS_API_BASE_URL,
    '/groups/',
    USER_CONFIG.DB_ATLAS_PROJECT_ID,
    '/clusters/',
    USER_CONFIG.DB_ATLAS_CLUSTER_NAME
  ].join(''),

  /** Mongodb Atlas API URL */
  DB_ATLAS_SEARCH_INDEX_API_URL: [
    USER_CONFIG.DB_ATLAS_API_BASE_URL,
    '/groups/',
    USER_CONFIG.DB_ATLAS_PROJECT_ID,
    '/clusters/',
    USER_CONFIG.DB_ATLAS_CLUSTER_NAME,
    '/fts/indexes'
  ].join(''),

  /** Mongodb Atlas API URL */
  DB_ATLAS_DIGEST_AUTH: [
    USER_CONFIG.DB_ATLAS_API_PUBLIC_KEY,
    ':',
    USER_CONFIG.DB_ATLAS_API_PRIVATE_KEY
  ].join(''),

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
  },

  register: function <T=any>(
    type:'state',
    id: string,
    key: T
  ): void {
    switch (type) {
    case 'state':
      STATE_REGISTRY[id] = key
      return
    }
  },

  getRegistry: function (type:'state') {
    switch (type) {
    case 'state':
      return STATE_REGISTRY
    }
  },
}

Config.init(initObj)

// Makes config object key available in suggestions
export type TAppConfig = IConfiguration & typeof initObj

export default Config as TAppConfig
