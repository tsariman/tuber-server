import { FastifyInstance } from 'fastify'
import get_bookmarks_collection_endpoint from '../endpoint/get.bookmarks.ep'
import get_bookmarks_by_id_endpoint from '../endpoint/get.bookmarks.id.ep'
import post_bookmarks_endpoint from '../endpoint/post.bookmarks.ep'
import put_bookmarks_by_id_endpoint from '../endpoint/put.bookmarks.id.ep'
import delete_bookmarks_by_id_endpoint from '../endpoint/delete.bookmarks.id.ep'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPut,
  IBookmarkDelete
} from '../schema/bookmarks'
import Config from '../config'
import dev_post_bookmarks_endpoint from '../DEV/endpoint/dev.post.bookmarks.ep'

const opts = {
  ...DEFAULT_OPTIONS,
}

export default async function bookmarks_controller(fastify: FastifyInstance) {
  const postBookmark = Config.DEV
    ? dev_post_bookmarks_endpoint
    : post_bookmarks_endpoint

  // GET /notes
  fastify.get<IBookmarkGet>('/', opts, get_bookmarks_collection_endpoint)

  // GET /notes/:id
  fastify.get<IBookmarkGet>('/:id', opts, get_bookmarks_by_id_endpoint)

  // POST /notes
  fastify.post<IBookmarkPost>('/', opts, postBookmark)

  // PUT /notes/:id (update)
  fastify.put<IBookmarkPut>('/:id', opts, put_bookmarks_by_id_endpoint)

  // DELETE /notes/:id (delete)
  fastify.delete<IBookmarkDelete>('/:id', opts, delete_bookmarks_by_id_endpoint)
}
