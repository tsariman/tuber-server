import { FastifyPluginAsync } from 'fastify'
import get_bookmark_collection_endpoint from '../handlers/get.bookmark.collection.ep'
import get_bookmark_by_id_endpoint from '../handlers/get.bookmark.by.id.ep'
import post_bookmark_endpoint from '../handlers/post.bookmark.ep'
import patch_bookmark_by_id_endpoint from '../handlers/patch.bookmark.by.id.ep'
import delete_bookmark_by_id_endpoint from '../handlers/delete.bookmark.by.id.ep'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPatch,
  IBookmarkDelete
} from '../schema/bookmarks'
import Config from '../config'
import dev_post_bookmarks_endpoint from '../dev/handlers/dev.post.bookmark.ep'
import get_video_thumbnail_url_endpoint, {
  IBookmarkThumbnailUrlGet
}  from '../platform/endpoint/get.video.thumbnail.url.ep'

const bookmarks: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts, ...DEFAULT_ROUTE_OPTIONS }

  const postBookmark = Config.DEV
    ? dev_post_bookmarks_endpoint
    : post_bookmark_endpoint

  // GET /bookmarks
  fastify.get<IBookmarkGet>(
    '/bookmarks',
    { ...DEFAULT_ROUTE_OPTIONS, onRequest: undefined },
    get_bookmark_collection_endpoint
  )

  // GET /bookmarks/:id
  fastify.get<IBookmarkGet>('/bookmarks/:id', opts, get_bookmark_by_id_endpoint)
  // GET /bookmarks/:id/thumbnail-url
  fastify.get<IBookmarkThumbnailUrlGet>(
    '/bookmarks/:id/thumbnail-url',
    opts,
    get_video_thumbnail_url_endpoint
  )

  // POST /bookmarks (create)
  fastify.post<IBookmarkPost>('/bookmarks', opts, postBookmark)

  // PATCH /bookmarks/:id (update)
  fastify.patch<IBookmarkPatch>('/bookmarks/:id', opts, patch_bookmark_by_id_endpoint)

  // DELETE /bookmarks/:id (delete)
  fastify.delete<IBookmarkDelete>('/bookmarks/:id', opts, delete_bookmark_by_id_endpoint)
}

export default bookmarks