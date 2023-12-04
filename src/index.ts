import mongoose from 'mongoose'
import app from './app'
import Config from './config'
import { DEV_DEFAULT_USER, DEV_USER } from './DEV/dev.install.common'
// import start_cron_jobs from './cron.jobs'
import {  configuration_get_all } from './model/configuration'
import { find_index_by_name } from './business.logic/network'

mongoose.set('strictQuery', false)

app.listen({ port: Config.FASTIFY_PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  process.stdout.write(`🚀 tuber server running at ${address}\n\n`)
  process.stdout.write(`process.env.NODE_ENV = ${Config.NODE_ENV}\n`)
  process.stdout.write(`Config.DEV = ${Config.DEV}\n`)
  const DB_URI = Config.DB_REMOTE ? Config.DB_URI_REMOTE : Config.DB_URI_LOCAL
  Config.log('\nDatabase URI:', DB_URI)

  const database = Config.DB_REMOTE // Config.DB_PROTOCOL.slice(-6) === 'srv://'
    ? 'Atlas'
    : 'Mongodb'
  Config.print(`\nConnecting to ${database}... `)

  // Note: Use '127.0.0.1' instead of 'localhost' if connecting locally.
  mongoose.connect(DB_URI).then(async () => {
    Config.log('Success!')

    // If using Mongodb Atlas,
    if (database === 'Atlas') {
      Config.print('\nCheck bookmarks search index... ')
      const searchIndex = await find_index_by_name('bookmark_search', 'bookmarks')
      if (searchIndex) {
        Config.log('Done.')
      } else {
        Config.log(`failed.\nbookmarks index needs to be defined.`)
        Config.log(`Visit endpoint: /dev/setup-collection-index-search/bookmarks`)
        Config.log('OR')
        Config.log(`Visit endpoint: /install/setup-collection-index-search/bookmarks`)
      }
    }

    // Check if dev user exists
    if (Config.DEV) {
      const devUser = await DEV_USER.findOne({ name: DEV_DEFAULT_USER.name })
      Config.log('')
      if (devUser) {
        Config.log('"Dev user" is available.\n')
        Config.write('dev_user_available', true)
      } else {
        Config.write('dev_user_available', false)
        Config.log('Dev user is not available.\n')
      }
    }

    // Load configuration values from database in Config object.
    Config.print('Loading configuration from database... ')
    const dbConfigs = await configuration_get_all()
    if (dbConfigs.length > 0) {
      await Config.load(dbConfigs)
      Config.log('Done.')
    } else {
      Config.log('Failed! No configuration found in database.')
    }

    // Uncomment this to start cron jobs.
    // Config.print('Setting up cron jobs... ')
    // start_cron_jobs()
    // Config.log('Done.')
  }, err => {
    Config.log('Failed!\n')
    console.error(err)
    process.exit(1)
  })

})
