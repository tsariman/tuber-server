import { FastifyPluginAsync } from 'fastify'
import get_bookmark_collection_endpoint from '../bookmarks/get.bookmark.collection.ep'
import get_bookmark_by_id_endpoint from '../bookmarks/get.bookmark.by.id.ep'
import patch_bookmark_by_id_endpoint from '../bookmarks/patch.bookmark.by.id.ep'
import delete_bookmark_by_id_endpoint from '../bookmarks/delete.bookmark.by.id.ep'
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPatch,
  IBookmarkDelete
} from '../../schema/bookmark'
import dev_post_bookmark_endpoint from '../../dev/handlers/dev.post.bookmark.ep'
import get_video_thumbnail_url_endpoint, {
  IBookmarkThumbnailUrlGet
}  from '../../platform/endpoint/get.video.thumbnail.url.ep'

const bookmarks: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = {
    ...rootOpts
    // TODO - Add middlewares here when needed.
  }

  // GET /bookmarks
  fastify.get<IBookmarkGet>('/', opts, get_bookmark_collection_endpoint)
  // GET /bookmarks/:id
  fastify.get<IBookmarkGet>('/:id', opts, get_bookmark_by_id_endpoint)
  // GET /bookmarks/:id/thumbnail-url
  fastify.get<IBookmarkThumbnailUrlGet>('/:id/thumbnail-url', opts, get_video_thumbnail_url_endpoint)
  // POST /bookmarks (create)
  fastify.post<IBookmarkPost>('/', opts, dev_post_bookmark_endpoint)
  // PATCH /bookmarks/:id (update)
  fastify.patch<IBookmarkPatch>('/:id', opts, patch_bookmark_by_id_endpoint)
  // DELETE /bookmarks/:id (delete)
  fastify.delete<IBookmarkDelete>('/:id', opts, delete_bookmark_by_id_endpoint)
}

export default bookmarks