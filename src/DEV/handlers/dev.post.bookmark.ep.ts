import { FastifyReply, FastifyRequest } from 'fastify'
import { default_500_error_response } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { task, task_end } from '../../utility/logging'
import { create_bookmark } from '../../model/bookmark'
import { IBookmarkPost } from '../../schema/bookmarks'
import { gen_random_bookmark_votes } from '..'

import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import fix_missing_bookmark_data from '../../platform/all.drivers'

/** POST /dev/bookmarks */
export default async function dev_post_bookmark_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  try {
    const attr = req.body.data?.attributes
    task(`Creating [${attr?.platform}] bookmark... `)

    // Generate random votes for development purposes
    const attrWithVotes = gen_random_bookmark_votes(attr)
    const bookmark = await fix_missing_bookmark_data(attrWithVotes, req.usr)

    if (!bookmark) {
      task_end('Failed.')
      reply.code(500).send(default_500_error_response({
        title: 'Failed to create bookmark.',
        detail: 'Bookmark is null.'
      }))
      return
    }
    const dbBookmark = await create_bookmark(bookmark)
    task_end('Done.')
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks').build()
    )
  } catch (e) {
    task_end(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}