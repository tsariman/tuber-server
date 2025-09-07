import { FastifyInstance } from 'fastify';
import get_bookmarks_collection_endpoint from '../endpoint/get.bookmark.ep';
import get_bookmark_by_id_endpoint from '../endpoint/get.bookmark.by.id.ep';
import post_bookmark_endpoint from '../endpoint/post.bookmark.ep';
import put_bookmark_by_id_endpoint from '../endpoint/put.bookmark.by.id.ep';
import delete_bookmark_by_id_endpoint from '../endpoint/delete.bookmark.by.id.ep';
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option';
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPut,
  IBookmarkDelete
} from '../schema/bookmarks';
import Config from '../config';
import dev_post_bookmarks_endpoint from '../DEV/endpoint/dev.post.bookmark.ep';
import get_video_thumbnail_url_endpoint, {
  IBookmarkThumbnailUrlGet
}  from '../platform/endpoint/get.video.thumbnail.url.ep';

/** Default options */
const opts = { ...DEFAULT_ROUTE_OPTIONS }

export default async function bookmark_controller(fastify: FastifyInstance) {
  const postBookmark = Config.DEV
    ? dev_post_bookmarks_endpoint
    : post_bookmark_endpoint

  // GET /bookmarks
  fastify.get<IBookmarkGet>(
    '/',
    { ...DEFAULT_ROUTE_OPTIONS, onRequest: undefined },
    get_bookmarks_collection_endpoint
  )

  // GET /bookmarks/:id
  fastify.get<IBookmarkGet>('/:id', opts, get_bookmark_by_id_endpoint);
  // GET /bookmarks/:id/thumbnail-url
  fastify.get<IBookmarkThumbnailUrlGet>(
    '/:id/thumbnail-url',
    opts,
    get_video_thumbnail_url_endpoint
  );

  // POST /bookmarks (create)
  fastify.post<IBookmarkPost>('/', opts, postBookmark);

  // PUT /bookmarks/:id (update)
  fastify.put<IBookmarkPut>('/:id', opts, put_bookmark_by_id_endpoint);

  // DELETE /bookmarks/:id (delete)
  fastify.delete<IBookmarkDelete>('/:id', opts, delete_bookmark_by_id_endpoint);
}
