import { FastifyInstance } from 'fastify'
import index_controller from './controller/index.controller'
import bootstrap_controller from './controller/bootstrap.controller'
import dev_install_controller from './INSTALL.DEV'
import Config from './config'
import users_controller from './controller/users.controller'

export default async function router(fastify: FastifyInstance) {
  // usersController
  fastify.register(index_controller, { prefix: '/' })
  fastify.register(bootstrap_controller, { prefix: '/3dad18f2d7bf2214a082c735880bcde9' })
  fastify.register(users_controller, { prefix: '/users' })
  if (Config.DEV) {
    fastify.register(dev_install_controller, { prefix: '/install-dev' })
  }
}
