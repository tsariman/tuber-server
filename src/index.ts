import mongoose from 'mongoose'
import app from './app'
import Config from './config'
import { DEV_DEFAULT_USER, DEV_USER } from './INSTALL.DEV/dev.install.common'
import { find_index_by_name } from './business.logic'

mongoose.set('strictQuery', false)

app.listen({ port: Config.FASTIFY_PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  process.stdout.write(`🚀 tuber server running at ${address}\n\n`)
  process.stdout.write(`process.env.NODE_ENV = ${Config.NODE_ENV}\n`)
  process.stdout.write(`Config.DEV = ${Config.DEV}\n`)

  // TODO That comparison might not be the best way to test if we're connecting
  //      to MongoDB Atlas
  const database = Config.DB_PROTOCOL.slice(-6) === 'srv://'
    ? 'Atlas'
    : 'Mongodb'
  Config.print(`\nConnecting to ${database}... `)

  // Note: Use '127.0.0.1' instead of 'localhost' if connecting locally.
  mongoose.connect(Config.DB_URI).then(async () => {
    Config.log('Success!')
    Config.log('\nDatabase URI:', Config.DB_URI)

    // If using Mongodb Atlas,
    if (database === 'Atlas') {
      Config.print('\nCheck annotations search index... ')
      const searchIndex = await find_index_by_name('annotation_search', 'annotations')
      if (searchIndex) {
        Config.log('done.')
      } else {
        Config.log(`failed.\nannotations index needs to be defined.`)
        Config.log(`Visit endpoint: /install-dev/setup-collection-index-search/annotations`)
        Config.log('OR')
        Config.log(`Visit endpoint: /install/setup-collection-index-search/annotations`)
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

    // await mongoose.disconnect()
  }, err => {
    Config.log('Failed!\n')
    Config.log('Database URI:', Config.DB_URI)
    console.error(err)
    process.exit(1)
  })

})
