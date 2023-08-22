import mongoose from 'mongoose'
import app from './app'
import Config from './config'

mongoose.set('strictQuery', false)
const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 8080

app.listen({ port: FASTIFY_PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`🚀 tuber server running at ${address}`)

  mongodbConnect().then(() => {
    Config.log(`Database URL: '${Config.DB_URL}'`)
  }, err => {
    process.stdout.write('Failed!\n\n')
    console.error(err)
    process.exit(1)
  })

  async function mongodbConnect() {
    process.stdout.write('Connecting to mongodb... ')

    // [fixed-issue] Mongodb refuses connection if you use 'localhost'
    //               instead of '127.0.0.1'
    // https://www.mongodb.com/community/forums/t/mongooseserverselectionerror-connect-econnrefused-127-0-0-1-27017/123421
    await mongoose.connect(Config.DB_URL) // 'mongodb://127.0.0.1:27017/test'
    process.stdout.write('Success!\n\n')
    await mongoose.connection.close()
  }
})
