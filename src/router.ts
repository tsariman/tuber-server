import { FastifyInstance } from 'fastify'
import index_controller from './controller/index.controller'
import bootstrap_controller from './controller/bootstrap.controller'
import dev_install_controller from './INSTALL.DEV/dev.controller'
import Config from './config'
import users_controller from './controller/users.controller'
import authentification_controller from './controller/authentification.controller'
import annotations_controller from './controller/annotations.controller'

export default async function router(fastify: FastifyInstance) {
  fastify.register(authentification_controller, { prefix: '/authentification'})
  fastify.register(index_controller, { prefix: '/' })
  fastify.register(bootstrap_controller, { prefix: '/3dad18f2d7bf2214a082c735880bcde9' })
  fastify.register(users_controller, { prefix: '/users' })
  fastify.register(annotations_controller, { prefix: '/annotations' })
  if (Config.DEV) {
    fastify.register(dev_install_controller, { prefix: '/install-dev' })
  }
}
