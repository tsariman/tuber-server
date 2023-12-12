import { FastifyInstance } from 'fastify'
import index_controller from './controller/index.controller'
import bootstrap_controller from './controller/bootstrap.controller'
import dev_controller from './DEV/dev.controller'
import prod_install_controller from './INSTALL/prod.controller'
import Config from './config'
import users_controller from './controller/users.controller'
import authenticate_controller from './controller/authenticate.controller'
import signout_controller from './controller/signout.controller'
import bookmarks_controller from './controller/bookmarks.controller'
import platform_controller from './platform/platform.controller'
import state_controller from './state/state.controller'
import JsonapiErrorBuilder, {
  default_404_error_response
} from './business.logic/jsonapi.error.builder'
import * as C from './constants'

export default async function router(fastify: FastifyInstance) {

  // Default 500 handler
  // [TODO] Dosn't work. Fix it.
  fastify.setErrorHandler((error, _req, reply) => {
    Config.log('[ERROR]', error)
    const status = error.statusCode ?? 500
    reply.status(status).send(new JsonapiErrorBuilder()
      .withStatus(status)
      .withTitle(error.message)
      .withDetail(error.stack)
      .withMeta('error', error)
      .build()
    )
  })

  // Default 404 handler
  fastify.register(function (instance, _options, done) {
    instance.setNotFoundHandler((req, reply) => {
      const url = new URL(req.raw.url ?? '', 'http://localhost:3000')
      reply.code(404).send(default_404_error_response({
        title: 'The requested resource could not be found.',
        source: { pointer: `${url.pathname}${url.search}` }
      }))
    })
    done()
  })

  fastify.register(authenticate_controller, { prefix: `/${C.EP_AUTHENTICATE}` })
  fastify.register(signout_controller, { prefix: `/${C.EP_SIGNOUT}` })
  fastify.register(index_controller, { prefix: '/' })
  fastify.register(state_controller, { prefix: `/${C.EP_STATE}` })
  fastify.register(bootstrap_controller, { prefix: '/3dad18f2d7bf2214a082c735880bcde9' })
  fastify.register(users_controller, { prefix: `/${C.EP_USERS}` })
  fastify.register(bookmarks_controller, { prefix: `/${C.EP_BOOKMARKS}` })
  if (Config.DEV) {
    fastify.register(dev_controller, { prefix: `/${C.EP_DEV}` })
  } else { /*[TODO] Add permission here. Administrator and above */
    fastify.register(prod_install_controller, { prefix: `/${C.EP_INSTALL}` })
  }

  // [TODO] Add permission here. Administrator and above
  fastify.register(platform_controller, { prefix: `/${C.EP_PLATFORM}` })
}
