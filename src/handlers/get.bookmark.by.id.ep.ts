import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../business.logic/errors'
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder'
import { ler, log_err, task, task_end } from '../utility/logging'
import { read_bookmark_by_id } from '../model/bookmark'
import { IBookmarkGet } from '../schema/bookmarks'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/** `GET /bookmarks/:id` */
export default async function get_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    task(`[DEBUG] Getting bookmark with id '${request.params.id}'... `)
    const bookmark = await read_bookmark_by_id(request.params.id)
    if (bookmark) {
      task_end('Done.')
      reply.code(200).send(
        JsonapiResponseBuilder.forSingleResource(bookmark, 'bookmarks').build()
      )
    } else {
      task_end('Failed.\n[DEBUG][404] Bookmark not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail(`Bookmark with id '${request.params.id}' not found.`)
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('GET bookmark by id', e)
    reply.code(500).send(default_500_error_response(e))
  }
}