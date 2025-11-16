import fp from 'fastify-plugin'
import cors, { FastifyCorsOptions } from '@fastify/cors'
import Config from '../config'

/**
 * This plugin adds CORS support to the Fastify application
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(async (fastify, opts) => {
  const corsOptions: FastifyCorsOptions = {
    origin: Config.DEV
      ? true // Allow all origins in development
      : Config.CLIENT_DOMAIN || false, // Use configured client domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }

  fastify.register(cors, corsOptions)
})