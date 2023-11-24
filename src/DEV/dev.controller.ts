/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import dev_post_create_update_dev_user_endpoint from './endpoint/dev.post.dev.user.ep'
import dev_post_database_reset_endpoint from './endpoint/dev.post.database.reset.ep'
import {
  dev_post_load_test_drawer_endpoint,
  dev_post_unload_test_drawer_endpoint
} from './endpoint'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import {
  dev_post_bookmarks_populate_endpoint,
  dev_post_users_populate_endpoint
} from './endpoint/dev.post.populate.collections.ep'
import post_bookmarks_api_setup_search_index_endpoint
  from '../endpoint/post.bookmarks.api.search.index.ep'
import dev_post_populate_collection_endpoint
  from './endpoint/dev.post.populate.collection.ep'
import dev_delete_drop_collection_endpoint
  from './endpoint/dev.delete.drop.collection.ep'
import dev_get_no_response_hangtime_endpoint
  from './endpoint/dev.get.no.response.hangtime.ep'
import dev_get_html_page_endpoint from './endpoint/dev.get.html.page.ep'
import dev_get_rumble_thumbnail_endpoint
  from './endpoint/dev.get.rumble.thumbnail.ep'
import dev_get_odysee_thumbnail_endpoint from './endpoint/dev.get.odysee.thumbnail.ep'
import dev_get_vimeo_thumbnail_endpoint from './endpoint/dev.get.vimeo.thumbnail.ep'
import dev_get_twitch_thumbnail_endpoint
  from './endpoint/dev.get.twitch.thumbnail.ep'
import {
  get_twitch_renew_access_token_endpoint
} from '../platform/endpoint/get.twitch.renew.access.token.ep'
import dev_post_state_pages_endpoint from './endpoint/dev.post.state.pages.ep'
import dev_post_state_forms_endpoint from './endpoint/dev.post.state.forms.ep'
import  {
  dev_post_authorizations_save_key_endpoint,
  dev_post_authorizations_save_url_endpoint
}  from './endpoint/dev.post.save.authorizations.ep'
import dev_post_rumble_regexp_endpoint from './endpoint/dev.post.rumble.regexp.ep'
import dev_post_unknown_regexp_endpoint from './endpoint/dev.post.unknown.regexp.ep'
import dev_post_twitch_client_id_endpoint
  from './endpoint/dev.post.twitch.client.id.ep'
import dev_post_save_config_value_endpoint
  from './endpoint/dev.post.save.config.value.ep'

interface IDevPopulateEndpoint {
  Params: {
    total: string
  }
}

const opts = {
  ...DEFAULT_OPTIONS,
  // TODO Add custom route options here
}

export default async function dev_controller(fastify: FastifyInstance) {

  fastify.get('/', opts, async function (
    _request: FastifyRequest,
    _reply: FastifyReply
  ) {

  })

  fastify.get('/get-html-page', {}, dev_get_html_page_endpoint)

  // Creates the default user for development purposes.
  fastify.post('/user', dev_post_create_update_dev_user_endpoint)
  // Reset the database for development purposes.
  fastify.post('/database-reset', dev_post_database_reset_endpoint)
  // Adds the test drawer to client side.
  fastify.post('/load-test-drawer', dev_post_load_test_drawer_endpoint)
  // Removes the test drawer from client side.
  fastify.post('/unload-test-drawer', dev_post_unload_test_drawer_endpoint)
  // Populates the users collection with random data.
  fastify.post<IDevPopulateEndpoint>('/populate/users/:total',
    {},
    dev_post_users_populate_endpoint
  )
  // Populates the bookmarks collection with random data.
  fastify.post<IDevPopulateEndpoint>('/populate/bookmarks/:total',
    {},
    dev_post_bookmarks_populate_endpoint
  )
  // No response endpoint for testing purposes.
  fastify.get('/no-response/:hangTime',
    {},
    dev_get_no_response_hangtime_endpoint
  )
  // Drops a collection from the database.
  fastify.delete('/drop-collection/:collection',
    {},
    dev_delete_drop_collection_endpoint
  )
  // Populate a collection with random data.
  fastify.post(
    '/populate-collection',
    {},
    dev_post_populate_collection_endpoint
  )
  // [TODO] Move these endpoints to the bookmarks controller.
  fastify.post('/setup-collection-index-search/bookmarks',
    {},
    post_bookmarks_api_setup_search_index_endpoint
  )
  // [TODO] Maybe useless. Remove it.
  fastify.post('/state/pages', {}, dev_post_state_pages_endpoint)
  // [TODO] Maybe useless. Remove it.
  fastify.post('/state/forms', {}, dev_post_state_forms_endpoint)
  // Save authorizations to the database.
  fastify.post('/save-authorization-key',
    {},
    dev_post_authorizations_save_key_endpoint
  )
  fastify.post('/save-authorization-url',
    {},
    dev_post_authorizations_save_url_endpoint
  )
  // Use the regexp to extract the data from the HTML page which is fetched from
  // the URL.
  fastify.post('/rumble/regexp', {}, dev_post_rumble_regexp_endpoint)
  // Use the regexp to extract the data from the HTML page which is fetched from
  // the URL.
  fastify.post('/unknown/regexp', {}, dev_post_unknown_regexp_endpoint)
  // Get a rumble video thumbnail
  fastify.get('/rumble/thumbnails', {}, dev_get_rumble_thumbnail_endpoint)
  fastify.get('/odysee/thumbnails', {}, dev_get_odysee_thumbnail_endpoint)
  fastify.get('/vimeo/thumbnails', {}, dev_get_vimeo_thumbnail_endpoint)
  fastify.get('/twitch/thumbnails', {}, dev_get_twitch_thumbnail_endpoint)
  // [TODO] Does not belong here. Move it to apporiate controller.
  fastify.get('/twitch/renew-access-token',
    {},
    get_twitch_renew_access_token_endpoint
  )
  fastify.post('/twitch/client-id', {}, dev_post_twitch_client_id_endpoint)
  fastify.post('/save-config-value', {}, dev_post_save_config_value_endpoint)
}
