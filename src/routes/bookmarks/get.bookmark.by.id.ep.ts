import { FastifyReply, FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { errr, ler, log_err, task } from '../../utility/logging'
import { read_bookmark_by_id } from '../../model/bookmark'
import { IBookmarkGet } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'

/** `GET /bookmarks/:id` endpoint handler */
export default async function get_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    task('Validating id parameter ')
    const id = request.params?.id
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      task.end('[❌]')
      errr(`[400] Invalid id parameter: ${id}`)
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
    task.end('[✔️]')
    task(`Getting bookmark with id '${id}' `)
    const bookmark = await read_bookmark_by_id(id)
    if (bookmark) {
      // Check access control
      if (bookmark.is_published || Access.the(request.usr).canRead(bookmark)) {
        task.end('[✔️]')
        reply.code(200).send(
          JsonapiResponseBuilder.forSingleResource(bookmark, 'bookmarks').build()
        )
      } else {
        task.end('[❌]')
        errr(`[403] Access denied to bookmark with id '${id}'`)
        reply.code(403).send(new JsonapiErrorBuilder()
          .withStatus(403)
          .withTitle('Forbidden')
          .withDetail(`Access denied to bookmark with id '${id}'.`)
          .build()
        )
      }
    } else {
      task.end('[❌]')
      errr(`[404] Bookmark not found with id '${id}'`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withDetail(`Bookmark with id '${id}' not found.`)
        .withDetail(`Bookmark with id '${request.params.id}' not found.`)
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5010]'))
    log_err('[5010] GET bookmark by id', e)
    reply.code(500).send(error_id(5010).default_500_error_response(e))
  }
}