import fp from 'fastify-plugin'
import cors, { FastifyCorsOptions } from '@fastify/cors'
import Config from '../config'

const normalize_origin = (value: string): string => value.trim().replace(/\/$/, '')

const build_allowed_origins = (): Set<string> => {
  const allowed = new Set<string>()
  const add = (origin?: string): void => {
    if (!origin) return
    const normalized = normalize_origin(origin)
    if (normalized) allowed.add(normalized)
  }

  add(Config.CLIENT_DOMAIN)
  add(process.env.PUBLIC_ORIGIN)

  const extraOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
  extraOrigins.forEach(add)

  return allowed
}

/**
 * This plugin adds CORS support to the Fastify application
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<FastifyCorsOptions>(async (fastify, opts) => {
  void opts
  const allowedOrigins = build_allowed_origins()
  const allowNullOrigin = (process.env.ADMIN_PANEL_ALLOW_NULL_ORIGIN ?? 'true') === 'true'

  const corsOptions: FastifyCorsOptions = {
    origin: Config.DEV
      ? true // Allow all origins in development
      : (origin, callback) => {
        // Non-browser callers often send no Origin header.
        if (!origin) {
          callback(null, true)
          return
        }

        // Local file-based admin panel requests send "null" origin.
        if (origin === 'null') {
          callback(null, allowNullOrigin)
          return
        }

        const normalized = normalize_origin(origin)
        callback(null, allowedOrigins.has(normalized))
      },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }

  fastify.register(cors, corsOptions)
})