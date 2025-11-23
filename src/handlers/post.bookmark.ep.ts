import { FastifyReply, FastifyRequest } from 'fastify'
import { default_500_error_response } from '../business.logic/errors'
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder'
import { dbug, ler, log_err, task, task_end } from '../utility/logging'
import { create_bookmark } from '../model/bookmark'
import { IBookmarkPost } from '../schema/bookmarks'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import fix_missing_bookmark_data from '../platform/all.drivers'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'

/** `POST /bookmarks` */
export default async function post_bookmark_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  try {
    const driver = new JsonapiRequestDriver(req.body)
    const platform = driver.getAttribute('platform')
    const attr = driver.getAttributes()
    task(`Creating [${platform}] bookmark... `)
    const bookmark = await fix_missing_bookmark_data(attr, req.usr)
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
    dbug('Sending response...', dbBookmark)
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks').build()
    )
    task_end('Done')
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('POST bookmark', e)
    reply.code(500).send(default_500_error_response(e))
  }
}