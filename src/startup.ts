import mongoose from 'mongoose'
import Config from './config'
import { DEV_DEFAULT_USER } from './dev/dev.install.common'
import start_cron_jobs from './cron.jobs'
import {  configuration_get_all } from './model/configuration'
import { find_index_by_name } from './business.logic/network'
import { readable_get_all } from './model/readable'
import { COLLECTION_NAME } from '@tuber/shared'
import { log, dbug, note } from './utility/logging'
import { UserModel } from './model/user'

mongoose.set('strictQuery', false)

const IS_TEST = process.env.TEST === 'true'

/**
 * Initializes the application after all plugins are loaded.
 * This includes database connection, user setup, configuration loading, etc.
 */
export async function initialize_app(): Promise<void> {
  header_printout()
  const DB_URI = Config.DB_REMOTE ? Config.DB_URI_REMOTE : Config.DB_URI_LOCAL
  console.log('\n[INFO] Database URI:', DB_URI)

  const database = Config.DB_REMOTE // Config.DB_PROTOCOL.slice(-6) === 'srv://'
    ? 'Atlas'
    : 'Mongodb'
  process.stdout.write(`\n[INFO] Connecting to ${database}... `)

  try {
    // Keep this below Fastify's default plugin timeout (10s) so we can handle
    // Atlas connection errors ourselves and log a friendly message.
    const connectTimeoutMs = Number(process.env.MONGOOSE_CONNECT_TIMEOUT_MS ?? 8000)
    // Note: Use '127.0.0.1' instead of 'localhost' if connecting locally.
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: connectTimeoutMs,
    })
  } catch (e) {
    const message = to_error_message(e)
    console.log('Failed')
    if (database === 'Atlas') {
      log('[INFO] Is the current IP address whitelisted on Atlas?')
      if (!is_likely_atlas_ip_access_error(message)) {
        log(`[INFO] Atlas connection details: ${message}`)
      }
    } else {
      log(`[ERROR] Database connection failed: ${message}`)
    }
    process.exit(1)
  }

  console.log('Success.')

  // If using Mongodb Atlas,
  if (database === 'Atlas') {
    process.stdout.write('\n[INFO] Checking bookmarks search index... ')
    const searchIndex = await find_index_by_name(
      Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
      COLLECTION_NAME
    )
    if (searchIndex) {
      console.log('Done.')
    } else {
      console.log('Failed.')
      note(`Search index, '${Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME}'`)
      log(' not defined for current database.')
      dbug(`Visit endpoint: /dev/setup-collection-index-search/bookmarks`)
      dbug('OR')
      dbug(`Visit endpoint: /install/setup-collection-index-search/bookmarks`)
    }
  }

  // Check if dev user exists
  if (Config.DEV) {
    const devUser = await UserModel.findOne({ name: DEV_DEFAULT_USER.name })
    console.log('')
    if (devUser) {
      dbug('"Dev user" is available.\n')
      Config.write('dev_user_available', true)
    } else {
      Config.write('dev_user_available', false)
      dbug('Dev user is not available.\n')
    }
  }

  // Load configuration values from database in Config object.
  process.stdout.write('[INFO] Loading configuration from database... ')
  const dbConfigs = await configuration_get_all()
  if (dbConfigs.length > 0) {
    await Config.load(dbConfigs)
    console.log('Done.')
  } else {
    console.log('Failed.\n[INFO][404] No configuration found in database.')
  }

  // Load readable text, if any, from the database into the readable cache.
  process.stdout.write('[INFO] Loading readables from the database... ')
  const dbReadables = await readable_get_all()
  if (dbReadables.length <= 0) {
    console.log('Failed.')
  } else {
    dbReadables.forEach(doc => Config.READABLE_CACHE.set(doc.key, doc.text))
    console.log('Done.')
  }

  // Start cron jobs for scheduled tasks (e.g., Twitch token renewal)
  process.stdout.write('[INFO] Setting up cron jobs... ')
  if (IS_TEST) {
    console.log('Skipped in test mode.')
  } else {
    start_cron_jobs()
    console.log('Done.')
  }
}

function to_error_message(e: unknown): string {
  if (e instanceof Error) {
    return e.message
  }
  return String(e)
}

function is_likely_atlas_ip_access_error(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('not in your atlas project')
    || lower.includes('access list')
    || lower.includes('whitelist')
}

function header_printout() {
  if (Config.DEV) {
    // process.stdout.write(`[INFO] 🚀 tuber server running at ${address}\n\n`)
    process.stdout.write(`[INFO] process.env.NODE_ENV = ${process.env.NODE_ENV}\n`)
    log(`[INFO] Config.DEV = ${Config.DEV}`)
    note('\n -------------------------------- \n')
    note('\n |     APP IS IN DEBUG MODE     | \n')
    note('\n -------------------------------- \n')
  }
}