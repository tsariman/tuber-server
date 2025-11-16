/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { IQueryDirective, IQueryEnvVar, IStatePost } from '../../common.types'
import dev_post_create_update_dev_user_endpoint from '../../dev/handlers/dev.post.dev.user.ep'
import dev_post_database_reset_endpoint from '../../dev/handlers/dev.post.database.reset.ep'
import {
  dev_post_load_test_drawer,
  dev_post_unload_test_drawer
} from '../../dev/handlers'
import { DEV_ROUTE_POTIONS } from '../../middleware/router.option'
import dev_post_user_endpoint from '../../dev/handlers/dev.post.user.ep'
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
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import Config from '../../config'

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
  if (Config.DEV) {
    const opts = {
      ...rootOpts,
      ...DEV_ROUTE_POTIONS
      // TODO Add custom route options here
    }
    // GET /dev
    fastify.get('/', {}, async function (
      req: FastifyRequest,
      reply: FastifyReply
    ) {
      reply.code(500).send(new JsonapiErrorBuilder()
        .withErrorMeta('url', `${req.protocol}://${req.hostname}${req.url}`)
        .build()
      )
    })
    // GET /dev/get-html-page
    fastify.get<{ Querystring: { url?: string }}>(
      '/get-html-page',
      opts,
      dev_get_html_page_endpoint
    )
    // POST /dev/user -- Creates the default user for development purposes.
    fastify.post('/user', opts, dev_post_create_update_dev_user_endpoint)
    // POST /dev/database-reset -- Reset the database for development purposes.
    fastify.post('/database-reset', opts, dev_post_database_reset_endpoint)
    // POST /dev/load-test-drawer -- Adds the test drawer to client side.
    fastify.post('/load-test-drawer', opts, dev_post_load_test_drawer)
    // POST /dev/unload-test-drawer -- Removes the test drawer from client side.
    fastify.post('/unload-test-drawer', opts, dev_post_unload_test_drawer)
    // POST /dev/populate/users/:total -- Populates the users collection with
    // random data.
    fastify.post<IPostPopulate>('/populate/users/:total',
      opts,
      dev_post_users_populate_endpoint
    )
    // POST /dev/populate/bookmarks/:total -- Populates the bookmarks
    // collection with random data.
    fastify.post<IPostPopulate>('/populate/bookmarks/:total',
      opts,
      dev_post_bookmarks_populate_endpoint
    )
    // GET /dev/no-response/:hangTime -- No response endpoint for testing purposes.
    fastify.get<{ Params: { hangTime: string }}>(
      '/no-response/:hangTime',
      opts,
      dev_get_no_response_hangtime_endpoint
    )
    // POST /dev/drop-collection/:collection -- Drops a collection from the database.
    fastify.delete<{ Params: { collection: string }}>(
      '/drop-collection/:collection',
      opts,
      dev_delete_collection_endpoint
    )
    // POST /dev/populate-collection -- Populate a collection with random data.
    fastify.post<{ Body: { collection: string, quantity: string }}>(
      '/populate-collection',
      opts,
      dev_post_populate_collection_endpoint
    )
    // POST /dev/setup-collection-index-search/bookmarks -- [TODO] Move these
    // endpoints to the bookmarks controller.
    fastify.post('/setup-collection-index-search/bookmarks',
      opts,
      post_bookmarks_api_setup_search_index_endpoint
    )
    // POST /dev/state/pages -- [TODO] Maybe useless. Remove it.
    fastify.post<IStatePost>(
      '/state/pages',
      opts,
      dev_post_state_pages_endpoint
    )
    // POST /dev/state/forms -- [TODO] Maybe useless. Remove it.
    fastify.post<IStatePost>(
      '/state/forms',
      opts,
      dev_post_state_forms_endpoint
    )
    // POST /dev/rumble/regexp -- Use the regexp to extract the data from the
    // HTML page which is fetched from the URL.
    fastify.post<IPostRegexpUrl>(
      '/rumble/regexp',
      opts,
      dev_post_rumble_regexp_endpoint
    )
    // POST /dev/unknown/regexp -- Use the regexp to extract the data from the
    // HTML page which is fetched from the URL.
    fastify.post<IPostRegexpUrl>(
      '/unknown/regexp',
      opts,
      dev_post_unknown_regexp_endpoint
    )
    // GET /dev/rumble/thumbnails -- Get a rumble video thumbnail
    fastify.get<{ Querystring: { slug?: string }}>(
      '/rumble/thumbnails',
      opts,
      dev_get_rumble_thumbnail_endpoint
    )
    // GET /dev/odysee/thumbnails
    fastify.get<{ Querystring: { slug?: string }}>(
      '/odysee/thumbnails',
      opts,
      dev_get_odysee_thumbnail_endpoint
    )
    // GET /dev/vimeo/thumbnails
    fastify.get<{ Querystring: { videoid?: string }}>(
      '/vimeo/thumbnails',
      opts,
      dev_get_vimeo_thumbnail_endpoint
    )
    // GET /dev/twitch/thumbnails
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
    // POST /dev/twitch/client-id
    fastify.post<IPostClient>(
      '/twitch/client-id',
      opts,
      dev_post_twitch_client_id_endpoint
    )
    // POST /dev/save-config-value
    fastify.post<IPostKeyVal>(
      '/save-config-value',
      opts,
      dev_post_save_config_value_endpoint
    )
    // GET /dev/environment-variable
    fastify.get<IQueryEnvVar>('/environment-variable', opts, dev_get_env_var_enpoint)
    // POST /dev/users -- Creates default user
    fastify.post<IQueryDirective>('/users', opts, dev_post_user_endpoint)
  }
}

export default dev