import fastify from 'fastify'
import router from './router'

// [PROD] comment out this line
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import { TCipheredUser } from './schema/users'

declare module 'fastify' {
  interface FastifyRequest {
    usr: TCipheredUser
  }
}

const server = fastify({
  // logger one for production
  logger: !!(process.env.NODE_ENV !== "development")
})

server.register(fastifyCookie)

// [PROD] Comment out this code
// Middleware: CORS
server.register(cors, {
  origin: ['http://localhost:3000']
})

// Middleware: Router
server.register(router)


export default server