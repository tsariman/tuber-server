import { FastifyInstance } from 'fastify';
import get_bookmark_collection_endpoint from '../../endpoint/get.bookmark.collection.ep';
import get_bookmark_by_id_endpoint from '../../endpoint/get.bookmark.by.id.ep';
import patch_bookmark_by_id_endpoint from '../../endpoint/patch.bookmark.by.id.ep';
import delete_bookmark_by_id_endpoint from '../../endpoint/delete.bookmark.by.id.ep';
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPatch,
  IBookmarkDelete
} from '../../schema/bookmarks';
import dev_post_bookmarks_endpoint from '../../DEV/endpoint/dev.post.bookmark.ep';
import get_video_thumbnail_url_endpoint, {
  IBookmarkThumbnailUrlGet
}  from '../../platform/endpoint/get.video.thumbnail.url.ep';

/** Default options */
const opts = {
  // TODO - Add middlewares here when needed.
};

export default async function bookmark_controller(fastify: FastifyInstance) {
  // GET /bookmarks
  fastify.get<IBookmarkGet>('/', opts, get_bookmark_collection_endpoint);
  // GET /bookmarks/:id
  fastify.get<IBookmarkGet>('/:id', opts, get_bookmark_by_id_endpoint);
  // GET /bookmarks/:id/thumbnail-url
  fastify.get<IBookmarkThumbnailUrlGet>('/:id/thumbnail-url', opts, get_video_thumbnail_url_endpoint);
  // POST /bookmarks (create)
  fastify.post<IBookmarkPost>('/', opts, dev_post_bookmarks_endpoint);
  // PATCH /bookmarks/:id (update)
  fastify.patch<IBookmarkPatch>('/:id', opts, patch_bookmark_by_id_endpoint);
  // DELETE /bookmarks/:id (delete)
  fastify.delete<IBookmarkDelete>('/:id', opts, delete_bookmark_by_id_endpoint);
}
