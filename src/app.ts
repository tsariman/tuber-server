import fastify from 'fastify'
import router from './router'

// [PROD] comment out this line
import cors from '@fastify/cors'
import fastifySession from '@fastify/secure-session'
import fastifyCookie from '@fastify/cookie'
import fs from 'fs'
import path from 'path'

const server = fastify({
  // logger one for production
  logger: !!(process.env.NODE_ENV !== "development")
})

server.register(fastifyCookie)

server.register(fastifySession, {
  sessionName: 'session',
  cookieName: 'my-session-cookie',
  key: fs.readFileSync(path.join(__dirname, 'secret-key'))
})

// [PROD] Comment out this code
// Middleware: CORS
server.register(cors, {
  origin: ['http://localhost:3000']
})

// Middleware: Router
server.register(router)


export default server