import { FastifyReply, FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { dbug, ler, log_err, task, task_end } from '../../utility/logging'
import { update_bookmark_by_id, read_bookmark_by_id } from '../../model/bookmark'
import { IBookmarkPatch } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { get_platform_specific_validator } from './_bookmarks.common.logic'

/** `PATCH /bookmarks/:id` endpoint handler */
export default async function patch_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkPatch>,
  reply: FastifyReply
) {
  try {
    dbug('request.body:', request.body)
    task('Checking request bookmark data... ')
    const driver = new JsonapiRequestDriver(request.body)
    const attributes = driver.getAttributes()
    if (!attributes) {
      task_end('Failed', '❌', '\n[DEBUG][400] Missing attributes.', request.body)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Failed to acquire the `attributes` member')
        .build()
      )
      return
    }
    task_end('OK', '✔️')
    task('Validating id parameter... ')
    const id = request.params?.id
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      task_end('Failed', '❌', `\n[DEBUG][400] Invalid id parameter: ${id}`)
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
    task_end('OK', '✔️')
    task('Acquiring platform specific validator... ')
    const validator = get_platform_specific_validator(attributes)

    if (validator) {
      task_end('OK', '✔️')
      task('Running validation... ')
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        task_end(`Failed`, `❌`, `\n[DEBUG][400] Validation error.`)
        reply.code(400).send(errorResponse)
        return
      }
    } else {
      const message = 'Platform is likely invalid'
      task_end(`Failed`, `❌`, `\n[DEBUG][422] ${message}.`)
      reply.code(422).send(new JsonapiErrorBuilder()
        .withStatus(422)
        .withCode('MISSING_DATA')
        .withTitle(message)
        .build()
      )
      return
    }
    task_end('OK', '✔️')
    task('Retrieving bookmark from database... ')
    const bookmark = await read_bookmark_by_id(id)
    
    if (!bookmark) {
      task_end('Failed', '❌', `\n[DEBUG][404] Bookmark not found with id: ${request.params.id}`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .withSource({ parameter: request.params.id })
        .build()
      )
      return
    }
    task_end('OK', '✔️')
    task('Checking access control... ')
    // Check access control
    if (Access.the(request.usr).canEdit(bookmark)) {
      task_end('OK', '✔️')
      task('Applying update... ')
      const updatedBookmark = await update_bookmark_by_id(id, attributes)
      if (updatedBookmark) {
        task_end('OK', '✔️')
        reply.code(204).send()
      } else {
        task_end('Failed', '❌', '\n[ERROR][500] Failed to update the bookmark.')
        reply.code(500).send(new JsonapiErrorBuilder()
          .withStatus(500)
          .withCode('DATABASE_ERROR')
          .withTitle('Internal Server Error')
          .withDetail('Failed to update the bookmark.')
          .build()
        )
      }
    } else {
      task_end('Access denied', '❌', '\n[DEBUG][404] Bookmark not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .withSource({ parameter: request.params.id })
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('PATCH bookmark by id', e)
    reply.code(500).send(default_500_error_response(e))
  }
}
