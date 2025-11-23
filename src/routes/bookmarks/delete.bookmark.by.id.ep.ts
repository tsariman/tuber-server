import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { ler, log_err, task, task_end } from '../../utility/logging'
import { BookmarkModel } from '../../model/bookmark'
import { IBookmarkDelete } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/** `DELETE /bookmarks/:id` */
export default async function delete_bookmark_by_id_endpoint (
  req: FastifyRequest<IBookmarkDelete>,
  reply: FastifyReply
) {
  try {
    task('Disabling bookmark... ')
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    )
    if (bookmark) {
      task_end('Done.')
      reply.code(204).send()
    } else {
      task_end('Failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
        .withTitle('Not Found')
        .withDetail(`Bookmark with id ${req.params.id} not found`)
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('DELETE bookmark by id', e)
    reply.code(500).send(default_500_error_response(e))
  }
}
