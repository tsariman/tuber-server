/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import dev_post_create_update_dev_user_endpoint from '../../dev/handlers/dev.post.dev.user.ep'
import dev_post_database_reset_endpoint from '../../dev/handlers/dev.post.database.reset.ep'
import {
  dev_post_load_test_drawer,
  dev_post_unload_test_drawer
} from '../../dev/handlers'
import { DEFAULT_ROUTE_OPTIONS, DEV_ROUTE_POTIONS } from '../../middleware/router.option'
import {
  dev_post_bookmarks_populate_endpoint,
  dev_post_users_populate_endpoint
} from '../../dev/handlers/dev.post.populate.collections.ep'
import post_bookmarks_api_setup_search_index_endpoint
  from '../../handlers/post.bookmark.api.search.index.ep'
import dev_post_populate_collection_endpoint
  from '../../dev/handlers/dev.post.populate.collection.ep'
import dev_delete_collection_endpoint
  from '../../dev/handlers/dev.delete.collection.ep'
import dev_get_no_response_hangtime_endpoint
  from '../../dev/handlers/dev.get.no.response.hangtime.ep'
import dev_get_html_page_endpoint from '../../dev/handlers/dev.get.html.page.ep'
import dev_get_rumble_thumbnail_endpoint
  from '../../dev/handlers/dev.get.rumble.thumbnail.ep'
import dev_get_odysee_thumbnail_endpoint from '../../dev/handlers/dev.get.odysee.thumbnail.ep'
import dev_get_vimeo_thumbnail_endpoint from '../../dev/handlers/dev.get.vimeo.thumbnail.ep'
import dev_get_twitch_thumbnail_endpoint from '../../dev/handlers/dev.get.twitch.thumbnail.ep'
import {
  get_twitch_renew_access_token_endpoint
} from '../../platform/endpoint/get.twitch.renew.access.token.ep'
import dev_post_state_pages_endpoint from '../../dev/handlers/dev.post.state.pages.ep'
import dev_post_state_forms_endpoint from '../../dev/handlers/dev.post.state.forms.ep'
import dev_post_rumble_regexp_endpoint from '../../dev/handlers/dev.post.rumble.regexp.ep'
import dev_post_unknown_regexp_endpoint from '../../dev/handlers/dev.post.unknown.regexp.ep'
import dev_post_twitch_client_id_endpoint
  from '../../dev/handlers/dev.post.twitch.client.id.ep'
import dev_post_save_config_value_endpoint
  from '../../dev/handlers/dev.post.save.config.value.ep'
import { TJsonapiRequest } from '@tuber/shared'
import dev_get_env_var_enpoint from '../../dev/handlers/dev.get.env.var.ep'

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
  Body: TJsonapiRequest<{
    key?: string
    value?: string
  }>
}

const dev: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = {
    ...rootOpts,
    ...DEFAULT_ROUTE_OPTIONS,
    // TODO Add custom route options here
  }

  const devOpts = {
    ...rootOpts,
    ...DEV_ROUTE_POTIONS
    // TODO Add custom route options here
  }

  fastify.get('/', {}, async function (
    _req: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.code(200).send({
      message: 'Hello from dev controller.'
    })
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
  fastify.post('/load-test-drawer', opts, dev_post_load_test_drawer)
  // Removes the test drawer from client side.
  fastify.post('/unload-test-drawer', opts, dev_post_unload_test_drawer)
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
    dev_delete_collection_endpoint
  )
  // Populate a collection with random data.
  fastify.post<{ Body: { collection: string, quantity: string }}>(
    '/populate-collection',
    opts,
    dev_post_populate_collection_endpoint
  )
  // [TODO] Move these endpoints to the bookmarks controller.
  fastify.post('/setup-collection-index-search/bookmarks',
    devOpts,
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
  fastify.get('/environment-variable', dev_get_env_var_enpoint);
}

export default dev