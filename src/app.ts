import fastify from 'fastify'
import router from './router'

// [PROD] comment out this line
import cors from '@fastify/cors'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import ROTATION_KEYS from './session.secrets'

const server = fastify({
  // logger one for production
  logger: !!(process.env.NODE_ENV !== "development")
})

server.register(fastifyCookie)

const oneDay = 1000 * 60 * 60 * 24
server.register(fastifySession, {
  cookieName: 'sessionId',
  secret: ROTATION_KEYS,
  saveUninitialized: true,
  cookie: {
    maxAge: oneDay,
    secure: 'auto',
  },
})

// [PROD] Comment out this code
// Middleware: CORS
server.register(cors, {
  origin: ['http://localhost:3000']
})

// Middleware: Router
server.register(router)


export default server