import { FastifyReply, FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { ler, log_err, task, task_end } from '../../utility/logging'
import { BookmarkModel } from '../../model/bookmark'
import { IBookmarkDelete } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'

/** `DELETE /bookmarks/:id` endpoint handler */
export default async function delete_bookmark_by_id_endpoint (
  req: FastifyRequest<IBookmarkDelete>,
  reply: FastifyReply
) {
  try {
    task('Validating id parameter... ')
    const id = req.params?.id
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      task_end('Failed.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('BAD_VALUE')
        .withTitle('Invalid ID')
        .withDetail('The provided bookmark id is invalid.')
        .withSource({ parameter: 'id' })
        .build()
      )
      return
    }
    task_end('OK')
    task('Retrieving bookmark from database... ')
    const bookmark = await BookmarkModel.findById(id)
    
    if (!bookmark) {
      task_end('Not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Not Found')
        .withDetail(`Bookmark with id ${id} not found`)
        .build()
      )
      return
    }
    task_end('Done.')
    
    // Check access control
    if (Access.the(req.usr).canDelete(bookmark)) {
      // If already inactive, no need to update
      if (!bookmark.is_active) {
        reply.code(204).send()
        return
      }
      task('Disabling bookmark... ')
      const updatedBookmark = await BookmarkModel.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
      )
      if (updatedBookmark) {
        task_end('Done.')
        reply.code(204).send()
      } else {
        task_end('Failed.')
        reply.code(500).send(new JsonapiErrorBuilder()
          .withStatus(500)
          .withCode('DATABASE_ERROR')
          .withTitle('Internal Server Error')
          .withDetail('Failed to update the bookmark.')
          .build()
        )
      }
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Not Found')
        .withDetail(`Bookmark with id ${id} not found`)
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5008]'))
    log_err('[5008] DELETE bookmark by id', e)
    reply.code(500).send(error_id(5008).default_500_error_response(e))
  }
}
