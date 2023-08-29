import mongoose from 'mongoose'
import app from './app'
import Config from './config'

mongoose.set('strictQuery', false)

app.listen({ port: Config.FASTIFY_PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  process.stdout.write(`🚀 tuber server running at ${address}\n`)
  
  mongodbConnect().then(() => {
    Config.log('Database URL:', Config.DB_URL)
  }, err => {
    Config.print('Failed!\n\n')
    Config.log('Database URL:', Config.DB_URL)
    console.error(err)
    process.exit(1)
  })

  async function mongodbConnect() {
    Config.print('Connecting to mongodb... ')

    // [fixed-issue] Mongodb refuses connection if you use 'localhost'
    //               instead of '127.0.0.1'
    // https://www.mongodb.com/community/forums/t/mongooseserverselectionerror-connect-econnrefused-127-0-0-1-27017/123421
    await mongoose.connect(Config.DB_URL)
    Config.print('Success!\n\n')
    await mongoose.connection.close()
  }
})
