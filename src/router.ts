import { FastifyInstance } from 'fastify'
import index_controller from './controller/index.controller'
import bootstrap_controller from './controller/bootstrap.controller'
import dev_controller from './DEV/dev.controller'
import prod_install_controller from './INSTALL/prod.controller'
import Config from './config'
import users_controller from './controller/users.controller'
import authentification_controller from './controller/authentification.controller'
import bookmarks_controller from './controller/bookmarks.controller'
import platform_controller from './platform/controller'
import state_controller from './state/state.controller'

export default async function router(fastify: FastifyInstance) {
  fastify.register(authentification_controller, { prefix: '/authentification'})
  fastify.register(index_controller, { prefix: '/' })
  fastify.register(state_controller, { prefix: '/state' })
  fastify.register(bootstrap_controller, { prefix: '/3dad18f2d7bf2214a082c735880bcde9' })
  fastify.register(users_controller, { prefix: '/users' })
  fastify.register(bookmarks_controller, { prefix: '/bookmarks' })
  if (Config.DEV) {
    fastify.register(dev_controller, { prefix: '/dev' })
  } else { /*[TODO] Add permission here. Administrator and above */
    fastify.register(prod_install_controller, { prefix: '/install' })
  }

  // [TODO] Add permission here. Administrator and above
  fastify.register(platform_controller, { prefix: '/platform' })
}
