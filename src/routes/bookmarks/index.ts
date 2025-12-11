import { FastifyPluginAsync } from 'fastify'
import get_bookmark_collection_endpoint from './get.bookmark.collection.ep'
import get_bookmark_by_id_endpoint from './get.bookmark.by.id.ep'
import post_bookmark_endpoint from './post.bookmark.ep'
import patch_bookmark_by_id_endpoint from './patch.bookmark.by.id.ep'
import delete_bookmark_by_id_endpoint from './delete.bookmark.by.id.ep'
import {
  DEFAULT_ROUTE_OPTIONS,
  PUBLIC_ROUTE_OPTIONS
} from '../../middleware/router.option'
import {
  IBookmarkGet,
  IBookmarkPost,
  IBookmarkPatch,
  IBookmarkDelete
} from '../../schema/bookmark'
import get_video_thumbnail_url_endpoint, {
  IBookmarkThumbnailUrlGet
}  from '../../platform/endpoint/get.video.thumbnail.url.ep'
import { put_bookmark_vote_by_id_endpoint } from './put.bookmark.vote.by.id.ep'
import { IBookmarkVotePut, IBookmarkVoteGet } from '../../schema/bookmark'
import { delete_bookmark_vote_by_id_endpoint } from './delete.bookmark.vote.by.id.ep'
import { get_bookmark_vote_by_id_endpoint } from './get.bookmark.vote.by.id.ep'

const bookmarks: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts, ...DEFAULT_ROUTE_OPTIONS }

  // const postBookmark = Config.DEV
  //   ? dev_post_bookmark_endpoint
  //   : post_bookmark_endpoint

  const $public = { ...rootOpts, ...PUBLIC_ROUTE_OPTIONS }

  // GET /bookmarks (read)
  fastify.get<IBookmarkGet>(
    '/',
    $public,
    get_bookmark_collection_endpoint
  )

  // GET /bookmarks/:id (read)
  fastify.get<IBookmarkGet>('/:id', opts, get_bookmark_by_id_endpoint)
  // GET /bookmarks/:id/thumbnail-url
  fastify.get<IBookmarkThumbnailUrlGet>(
    '/:id/thumbnail-url',
    opts,
    get_video_thumbnail_url_endpoint
  )

  // POST /bookmarks (create)
  fastify.post<IBookmarkPost>('/', opts, post_bookmark_endpoint)

  // PATCH /bookmarks/:id (update)
  fastify.patch<IBookmarkPatch>('/:id', opts, patch_bookmark_by_id_endpoint)

  // PUT /bookmarks/:id/vote (set current user vote)
  fastify.put<IBookmarkVotePut>('/:id/vote', opts, put_bookmark_vote_by_id_endpoint)

  // GET /bookmarks/:id/vote (current user vote state + counts)
  fastify.get<IBookmarkVoteGet>('/:id/vote', opts, get_bookmark_vote_by_id_endpoint)

  // DELETE /bookmarks/:id (delete)
  fastify.delete<IBookmarkDelete>('/:id', opts, delete_bookmark_by_id_endpoint)

  // DELETE /bookmarks/:id/vote (remove current user vote)
  fastify.delete<IBookmarkDelete>('/:id/vote', opts, delete_bookmark_vote_by_id_endpoint)
}

export default bookmarks