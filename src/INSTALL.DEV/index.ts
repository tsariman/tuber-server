/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import dev_create_update_dev_user from './middleware/dev.user'
import dev_database_reset from './middleware/dev.database.reset'
import { dev_load_test_drawer, dev_unload_test_drawer } from './middleware'
import { DEFAULT_OPTIONS } from 'src/middleware/router.option'

const opts = {
  ...DEFAULT_OPTIONS,
  // TODO Add custom route options here
}

export default async function dev_install_controller(fastify: FastifyInstance) {

  fastify.get('/', opts, async function (
    _request: FastifyRequest,
    _reply: FastifyReply
  ) {

  })

  // Creates the default user for development purposes.
  fastify.post('/user', dev_create_update_dev_user)
  // Reset the database for development purposes.
  fastify.post('/database-reset', dev_database_reset)
  fastify.post('/load-test-drawer', dev_load_test_drawer)
  fastify.post('/unload-test-drawer', dev_unload_test_drawer)
}
