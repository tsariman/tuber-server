import { FastifyReply, FastifyRequest } from 'fastify'
import { error_id } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { ler, log_err, task } from '../../utility/logging'
import { create_bookmark } from '../../model/bookmark'
import { IBookmarkPost } from '../../schema/bookmark'
import { gen_random_bookmark_votes } from '../../dev'

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
      task.end('[❌]')
      reply.code(500).send(error_id(5023).default_500_error_response({
        title: 'Failed to create bookmark.',
        detail: 'Bookmark is null.'
      }))
      return
    }
    const dbBookmark = await create_bookmark(bookmark)
    task.end('[✔️]')
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks').build()
    )
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5024]'))
    log_err('[5024] DEV POST BOOKMARK ERROR', e)
    reply.code(500).send(error_id(5024).default_500_error_response(e))
  }
}