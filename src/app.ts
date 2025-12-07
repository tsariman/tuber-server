import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import fastifyStatic from '@fastify/static'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env`})
import path from 'path'
import qs from 'qs'
import { log } from './utility/logging'
import JsonapiErrorBuilder from './business.logic/builder/JsonapiErrorBuilder'
import { initialize_app } from './startup'
import { setupJWT } from './jwt.config'
import { isCustomError } from './business.logic/errors'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Custom querystring parser for JSON:API bracket notation
  fastify.addHook('preHandler', (req, reply, done) => {
    void reply
    const url = req.raw.url
    if (url) {
      const queryIndex = url.indexOf('?')
      if (queryIndex !== -1) {
        const queryString = url.slice(queryIndex + 1)
        req.query = qs.parse(queryString, { allowPrototypes: true, depth: 10 })
      }
    }
    done()
  })

  // Register cookie support FIRST (JWT plugin needs this)
  await fastify.register(import('@fastify/cookie'), {
    secret: process.env.COOKIE_SECRET || 'my-secret-key-change-in-production'
  })

  // Setup JWT (after cookie support is available)
  await setupJWT(fastify)

  // Register the static plugin
  void fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/' // optional: default '/'
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

  // Set custom error handler for 500 errors
  fastify.setErrorHandler((e, req, reply) => {
    void req
    log('[ERROR]', e)
    const error = e instanceof Error ? e : new Error(String(e))
    const status = isCustomError(e) ? e.statusCode : 500
    reply.status(status).send(new JsonapiErrorBuilder()
      .withStatus(status)
      .withTitle(error.message)
      .withDetail(error.stack)
      .withMeta('error', e)
      .build()
    )
  })

  // Startup code - runs after all plugins are loaded
  fastify.addHook('onReady', async () => {
    await initialize_app()
  })
}

export default app
export { app, options }
