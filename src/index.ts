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
  console.log('\nDatabase URI:', DB_URI)

  const database = Config.DB_REMOTE // Config.DB_PROTOCOL.slice(-6) === 'srv://'
    ? 'Atlas'
    : 'Mongodb'
  process.stdout.write(`\nConnecting to ${database}... `)

  // Note: Use '127.0.0.1' instead of 'localhost' if connecting locally.
  mongoose.connect(DB_URI).then(async () => {
    console.log('Success!')

    // If using Mongodb Atlas,
    if (database === 'Atlas') {
      process.stdout.write('\nCheck bookmarks search index... ')
      const searchIndex = await find_index_by_name('bookmark_search', 'bookmarks')
      if (searchIndex) {
        console.log('Done.')
      } else {
        console.log(`failed.\nbookmarks index needs to be defined.`)
        Config.log(`[DEBUG] Visit endpoint: /dev/setup-collection-index-search/bookmarks`)
        Config.log('[DEBUG] OR')
        Config.log(`[DEBUG] Visit endpoint: /install/setup-collection-index-search/bookmarks`)
      }
    }

    // Check if dev user exists
    if (Config.DEV) {
      const devUser = await DEV_USER.findOne({ name: DEV_DEFAULT_USER.name })
      console.log('')
      if (devUser) {
        Config.log('[DEBUG] "Dev user" is available.\n')
        Config.write('dev_user_available', true)
      } else {
        Config.write('dev_user_available', false)
        Config.log('[DEBUG] Dev user is not available.\n')
      }
    }

    // Load configuration values from database in Config object.
    process.stdout.write('Loading configuration from database... ')
    const dbConfigs = await configuration_get_all()
    if (dbConfigs.length > 0) {
      await Config.load(dbConfigs)
      console.log('Done.')
    } else {
      console.log('Failed! No configuration found in database.')
    }

    // Uncomment this to start cron jobs.
    // process.stdout.write('Setting up cron jobs... ')
    // start_cron_jobs()
    // console.log('Done.')
  }, err => {
    console.log('Failed!\n')
    console.error(err)
    process.exit(1)
  })

})
