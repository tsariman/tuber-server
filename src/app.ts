import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import fastifyStatic from '@fastify/static'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env`})
import path from 'path'
import { log } from './utility/logging'
import JsonapiErrorBuilder from './business.logic/builder/JsonapiErrorBuilder'
import { initializeApp } from './startup'

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
  fastify.setErrorHandler((error, _req, reply) => {
    log('[ERROR]', error)
    const status = error.statusCode ?? 500
    reply.status(status).send(new JsonapiErrorBuilder()
      .withStatus(status)
      .withTitle(error.message)
      .withDetail(error.stack)
      .withMeta('error', error)
      .build()
    )
  })

  // Startup code - runs after all plugins are loaded
  fastify.addHook('onReady', async () => {
    await initializeApp()
  })
}

export default app
export { app, options }
