import { FastifyInstance } from 'fastify'
import indexController from './controller/index.controller'
import bootstrapController from './controller/bootstrap.controller'
import devInstallController from './INSTALL.DEV'
import Config from './config'
import usersController from './controller/users.controller'

export default async function router(fastify: FastifyInstance) {
  // usersController
  fastify.register(indexController, { prefix: '/' })
  fastify.register(bootstrapController, { prefix: '/3dad18f2d7bf2214a082c735880bcde9' })
  fastify.register(usersController, { prefix: '/users' })
  if (Config.DEV) {
    fastify.register(devInstallController, { prefix: '/install-dev' })
  }
}
