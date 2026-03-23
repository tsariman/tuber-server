/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { IQueryDirective, IQueryEnvVar, IStatePost } from '../../common.types'
import dev_post_create_update_dev_user_endpoint from './dev.post.dev.user.ep'
import dev_post_database_reset_endpoint from './dev.post.database.reset.ep'
import {
  dev_post_load_test_drawer,
  dev_post_unload_test_drawer
} from './dev.post.test.drawer.ep'
import { DEV_ROUTE_OPTIONS } from '../../middleware/router.option'
import dev_post_user_endpoint from './dev.post.user.ep'
import {
  dev_post_bookmarks_populate_endpoint,
  dev_post_users_populate_endpoint
} from './dev.post.populate.collections.ep'
import post_bookmarks_api_setup_search_index_endpoint
  from '../bookmarks/post.bookmark.api.search.index.ep'
import dev_post_populate_collection_endpoint
  from './dev.post.populate.collection.ep'
import dev_delete_collection_endpoint
  from './dev.delete.collection.ep'
import dev_get_no_response_hangtime_endpoint
  from './dev.get.no.response.hangtime.ep'
import dev_get_html_page_endpoint from './dev.get.html.page.ep'
import dev_get_rumble_thumbnail_endpoint
  from './dev.get.rumble.thumbnail.ep'
import dev_get_odysee_thumbnail_endpoint from './dev.get.odysee.thumbnail.ep'
import dev_get_vimeo_thumbnail_endpoint from './dev.get.vimeo.thumbnail.ep'
import dev_get_twitch_thumbnail_endpoint from './dev.get.twitch.thumbnail.ep'
import {
  get_twitch_renew_access_token_endpoint
} from '../../platform/endpoint/get.twitch.renew.access.token.ep'
import dev_post_state_pages_endpoint from './dev.post.state.pages.ep'
import dev_post_state_forms_endpoint from './dev.post.state.forms.ep'
import dev_post_rumble_regexp_endpoint from './dev.post.rumble.regexp.ep'
import dev_post_unknown_regexp_endpoint from './dev.post.unknown.regexp.ep'
import dev_post_twitch_client_id_endpoint
  from './dev.post.twitch.client.id.ep'
import dev_post_save_config_value_endpoint
  from './dev.post.save.config.value.ep'
import { TJsonapiRequest } from '@tuber/shared'
import dev_get_env_var_enpoint from './dev.get.env.var.ep'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import Config from '../../config'
import { IBookmarkDelete, IBookmarkGet, IBookmarkPatch, IBookmarkPost } from '../../schema/bookmark'
import get_video_thumbnail_url_endpoint, { IBookmarkThumbnailUrlGet } from '../../platform/endpoint/get.video.thumbnail.url.ep'
import get_bookmark_collection_endpoint from '../bookmarks/get.bookmark.collection.ep'
import get_bookmark_by_id_endpoint from '../bookmarks/get.bookmark.by.id.ep'
import dev_post_bookmark_endpoint from './dev.post.bookmark.ep'
import patch_bookmark_by_id_endpoint from '../bookmarks/patch.bookmark.by.id.ep'
import delete_bookmark_by_id_endpoint from '../bookmarks/delete.bookmark.by.id.ep'
import dev_post_generate_token_endpoint from './dev.post.generate.token.ep'
import { IUsersEndpoint, IUsersVoteEndpoint } from '../../schema/user'
import get_user_collection_endpoint from '../users/get.user.collection.ep'
import get_user_by_name_endpoint from '../users/get.user.by.name.ep'
import { put_user_vote_by_id_endpoint } from '../users/put.user.by.id.ep'

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
      ...DEV_ROUTE_OPTIONS
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
    // [TODO] Does not belong here. Move it to appropriate controller.
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
    // POST /dev/generate-token -- Generate JWT token for testing
    fastify.post<{ Body: { username?: string, expiresIn?: string }}>(
      '/generate-token',
      opts,
      dev_post_generate_token_endpoint
    )

    // bookmarks routes

    // TODO This is the wrong endpoint handler for this route but it allows us
    //      to test the bookmark collection endpoint logic without affecting
    //      the main /bookmarks endpoint. We should create dedicated endpoints
    //      for testing purposes in the dev controller instead of using the
    //      main ones.
    // GET /dev/bookmarks
    fastify.get<IBookmarkGet>('/bookmarks', opts, get_bookmark_collection_endpoint)
    // GET /dev/bookmarks/:id
    fastify.get<IBookmarkGet>('/bookmarks/:id', opts, get_bookmark_by_id_endpoint)
    // GET /dev/bookmarks/:id/thumbnail-url
    fastify.get<IBookmarkThumbnailUrlGet>('/bookmarks/:id/thumbnail-url', opts, get_video_thumbnail_url_endpoint)
    // POST /dev/bookmarks (create)
    fastify.post<IBookmarkPost>('/bookmarks/', opts, dev_post_bookmark_endpoint)
    // PATCH /dev/bookmarks/:id (update)
    fastify.patch<IBookmarkPatch>('/bookmarks/:id', opts, patch_bookmark_by_id_endpoint)
    // DELETE /dev/bookmarks/:id (delete)
    fastify.delete<IBookmarkDelete>('/bookmarks/:id', opts, delete_bookmark_by_id_endpoint)

    // users routes

    // GET /dev/users
    fastify.get<IUsersEndpoint>('/users', opts, get_user_collection_endpoint)
    // GET /dev/users/:name
    fastify.get<IUsersEndpoint>('/users/:name', opts, get_user_by_name_endpoint)
  
    // PUT /users/:id (update)
    // PUT /dev/users/:userId/vote (upvote/downvote)
    fastify.put<IUsersVoteEndpoint>('/users/:userId/vote', opts, put_user_vote_by_id_endpoint)
  
    // DELETE /users/:id (delete)
  }
}

export default dev