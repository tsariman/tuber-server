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
import dev_post_rumble_regexp_endpoint from './endpoint/dev.post.rumble.regexp.ep'
import dev_post_unknown_regexp_endpoint from './endpoint/dev.post.unknown.regexp.ep'
import dev_post_twitch_client_id_endpoint
  from './endpoint/dev.post.twitch.client.id.ep'
import dev_post_save_config_value_endpoint
  from './endpoint/dev.post.save.config.value.ep'

interface IPostPopulate {
  Params: {
    total: string
  }
}

interface IPostRegexpUrl {
  Body: {
    regexp?: string
    url?: string
  }
}

interface IPostClient {
  Body: {
    client_id?: string
    client_secret?: string
  }
}

interface IPostKeyVal {
  Body: {
    key?: string
    value?: string
  }
}

const opts = {
  ...DEFAULT_OPTIONS,
  // TODO Add custom route options here
}

export default async function dev_controller(fastify: FastifyInstance) {

  fastify.get('/', opts, async function (
    _req: FastifyRequest,
    _reply: FastifyReply
  ) {

  })

  fastify.get<{ Querystring: { url?: string }}>(
    '/get-html-page',
    opts,
    dev_get_html_page_endpoint
  )

  // Creates the default user for development purposes.
  fastify.post('/user', opts, dev_post_create_update_dev_user_endpoint)
  // Reset the database for development purposes.
  fastify.post('/database-reset', opts, dev_post_database_reset_endpoint)
  // Adds the test drawer to client side.
  fastify.post('/load-test-drawer', opts, dev_post_load_test_drawer_endpoint)
  // Removes the test drawer from client side.
  fastify.post('/unload-test-drawer', opts, dev_post_unload_test_drawer_endpoint)
  // Populates the users collection with random data.
  fastify.post<IPostPopulate>('/populate/users/:total',
    opts,
    dev_post_users_populate_endpoint
  )
  // Populates the bookmarks collection with random data.
  fastify.post<IPostPopulate>('/populate/bookmarks/:total',
    opts,
    dev_post_bookmarks_populate_endpoint
  )
  // No response endpoint for testing purposes.
  fastify.get<{ Params: { hangTime: string }}>(
    '/no-response/:hangTime',
    opts,
    dev_get_no_response_hangtime_endpoint
  )
  // Drops a collection from the database.
  fastify.delete<{ Params: { collection: string }}>(
    '/drop-collection/:collection',
    opts,
    dev_delete_drop_collection_endpoint
  )
  // Populate a collection with random data.
  fastify.post<{ Body: { collection: string, quantity: string }}>(
    '/populate-collection',
    opts,
    dev_post_populate_collection_endpoint
  )
  // [TODO] Move these endpoints to the bookmarks controller.
  fastify.post('/setup-collection-index-search/bookmarks',
    opts,
    post_bookmarks_api_setup_search_index_endpoint
  )
  // [TODO] Maybe useless. Remove it.
  fastify.post<{ Body: { key?: string }}>(
    '/state/pages',
    opts,
    dev_post_state_pages_endpoint
  )
  // [TODO] Maybe useless. Remove it.
  fastify.post<{ Body: { key?: string }}>(
    '/state/forms',
    opts,
    dev_post_state_forms_endpoint
  )
  // Use the regexp to extract the data from the HTML page which is fetched from
  // the URL.
  fastify.post<IPostRegexpUrl>(
    '/rumble/regexp',
    opts,
    dev_post_rumble_regexp_endpoint
  )
  // Use the regexp to extract the data from the HTML page which is fetched from
  // the URL.
  fastify.post<IPostRegexpUrl>(
    '/unknown/regexp',
    opts,
    dev_post_unknown_regexp_endpoint
  )
  // Get a rumble video thumbnail
  fastify.get<{ Querystring: { slug?: string }}>(
    '/rumble/thumbnails',
    opts,
    dev_get_rumble_thumbnail_endpoint
  )
  fastify.get<{ Querystring: { slug?: string }}>(
    '/odysee/thumbnails',
    opts,
    dev_get_odysee_thumbnail_endpoint
  )
  fastify.get<{ Querystring: { videoid?: string }}>(
    '/vimeo/thumbnails',
    opts,
    dev_get_vimeo_thumbnail_endpoint
  )
  fastify.get<{ Querystring: { videoid?: string }}>(
    '/twitch/thumbnails',
    opts,
    dev_get_twitch_thumbnail_endpoint
  )
  // [TODO] Does not belong here. Move it to apporiate controller.
  fastify.get('/twitch/renew-access-token',
    opts,
    get_twitch_renew_access_token_endpoint
  )
  fastify.post<IPostClient>(
    '/twitch/client-id',
    opts,
    dev_post_twitch_client_id_endpoint
  )
  fastify.post<IPostKeyVal>(
    '/save-config-value',
    opts,
    dev_post_save_config_value_endpoint
  )
}
