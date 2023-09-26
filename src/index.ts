import mongoose from 'mongoose'
import app from './app'
import Config from './config'
import { DEV_DEFAULT_USER, DEV_USER } from './INSTALL.DEV/dev.install.common'

mongoose.set('strictQuery', false)

app.listen({ port: Config.FASTIFY_PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  process.stdout.write(`🚀 tuber server running at ${address}\n`)
  Config.print('Connecting to mongodb... ')

  // [fixed-issue] Mongodb refuses connection if you use 'localhost'
  //               instead of '127.0.0.1'
  // https://www.mongodb.com/community/forums/t/mongooseserverselectionerror-connect-econnrefused-127-0-0-1-27017/123421
  mongoose.connect(Config.DB_URI).then(async () => {
    Config.log('Success!')
    Config.log('Database URI:', Config.DB_URI)

    // Check if dev user exists
    if (Config.DEV) {
      const devUser = await DEV_USER.findOne({ name: DEV_DEFAULT_USER.name })
      if (devUser) {
        Config.log('"Dev user" is available.\n')
        Config.write('dev_user_available', true)
      } else {
        Config.write('dev_user_available', false)
        Config.log('Dev user is not available.\n')
      }
    }

    await mongoose.disconnect()
  }, err => {
    Config.log('Failed!\n')
    Config.log('Database URI:', Config.DB_URI)
    console.error(err)
    process.exit(1)
  })

})
