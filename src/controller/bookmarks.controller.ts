import { FastifyInstance } from 'fastify'
import bookmarks_get_collection_endpoint from '../endpoint/bookmarks.get.ep'
import bookmarks_get_by_id_endpoint from '../endpoint/bookmarks.get.id.ep'
import bookmarks_post_endpoint from '../endpoint/bookmarks.post.ep'
import bookmarks_put_by_id_endpoint from '../endpoint/bookmarks.put.id.ep'
import bookmarks_delete_by_id_endpoint from '../endpoint/bookmarks.delete.id.ep'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPut,
  IBookmarkDelete
} from '../schema/bookmarks'
import Config from '../config'
import dev_bookmarks_post_endpoint from '../DEV/endpoint/dev.bookmarks.post.ep'

const opts = {
  ...DEFAULT_OPTIONS,
}

export default async function bookmarks_controller(fastify: FastifyInstance) {
  const postBookmark = Config.DEV
    ? dev_bookmarks_post_endpoint
    : bookmarks_post_endpoint

  // GET /notes
  fastify.get<IBookmarkGet>('/', opts, bookmarks_get_collection_endpoint)

  // GET /notes/:id
  fastify.get<IBookmarkGet>('/:id', opts, bookmarks_get_by_id_endpoint)

  // POST /notes
  fastify.post<IBookmarkPost>('/', opts, postBookmark)

  // PUT /notes/:id (update)
  fastify.put<IBookmarkPut>('/:id', opts, bookmarks_put_by_id_endpoint)

  // DELETE /notes/:id (delete)
  fastify.delete<IBookmarkDelete>('/:id', opts, bookmarks_delete_by_id_endpoint)
}
