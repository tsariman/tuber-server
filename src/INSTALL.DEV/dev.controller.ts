/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import dev_create_update_dev_user from './endpoint/dev.user'
import dev_database_reset from './endpoint/dev.database.reset'
import { dev_load_test_drawer, dev_unload_test_drawer } from './endpoint'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import { dev_populate_bookmarks, dev_populate_users } from './endpoint/dev.populate.collections'
import bookmarks_api_setup_search_index_endpoint from '../endpoint/bookmarks.api.search.index.ep'
import dev_populate_collection from './endpoint/dev.populate.collection.ep'
import dev_drop_collection from './endpoint/dev.drop.collection.ep'
import dev_no_response_hangtime from './endpoint/dev.no.response.hangtime.ep'
import dev_get_html_page from './endpoint/dev.get.html.page.ep'

interface IDevPopulateEndpoint {
  Params: {
    total: string
  }
}

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

  fastify.get('/get-html-page', {}, dev_get_html_page)

  // Creates the default user for development purposes.
  fastify.post('/user', dev_create_update_dev_user)
  // Reset the database for development purposes.
  fastify.post('/database-reset', dev_database_reset)
  // Adds the test drawer to client side.
  fastify.post('/load-test-drawer', dev_load_test_drawer)
  // Removes the test drawer from client side.
  fastify.post('/unload-test-drawer', dev_unload_test_drawer)
  // Populates the users collection with random data.
  fastify.post<IDevPopulateEndpoint>(
    '/populate/users/:total',
    dev_populate_users
  )
  // Populates the bookmarks collection with random data.
  fastify.post<IDevPopulateEndpoint>(
    '/populate/bookmarks/:total',
    dev_populate_bookmarks
  )
  // No response endpoint for testing purposes.
  fastify.get('/no-response/:hangTime', {}, dev_no_response_hangtime)
  // Drops a collection from the database.
  fastify.delete('/drop-collection/:collection', {}, dev_drop_collection)
  // Populate a collection with random data.
  fastify.post('/populate-collection', {}, dev_populate_collection)
  fastify.post('/setup-collection-index-search/bookmarks',
    {},
    bookmarks_api_setup_search_index_endpoint
  )
}
