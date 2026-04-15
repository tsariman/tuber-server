import { FastifyReply, FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { dbug, errr, ler, log_err, task } from '../../utility/logging'
import { update_bookmark_by_id, read_bookmark_by_id } from '../../model/bookmark'
import { IBookmarkPatch } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { get_platform_specific_validator } from './_bookmarks.common.logic'
import { validate_bookmark_note_link_access } from '../../business.logic/security/bookmark.note.links'

/** `PATCH /bookmarks/:id` endpoint handler */
export default async function patch_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkPatch>,
  reply: FastifyReply
) {
  try {
    dbug('request.body:', request.body)
    task('Checking request bookmark data ')
    const driver = new JsonapiRequestDriver(request.body)
    const attributes = driver.getAttributes()
    if (!attributes) {
      task.end('[❌]')
      errr('[400] Missing attributes in request body')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Failed to acquire the `attributes` member')
        .build()
      )
      return
    }

    const noteLinkAccessError = validate_bookmark_note_link_access(
      attributes.note,
      request.usr
    )
    if (noteLinkAccessError) {
      task.end('[❌]')
      reply.code(403).send(noteLinkAccessError)
      return
    }
    task.end('[✔️]')
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
    task('Acquiring platform specific validator ')
    const validator = get_platform_specific_validator(attributes)

    if (validator) {
      task.end('[✔️]')
      task('Running validation ')
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        task.end('[❌]')
        errr('[400] Validation error in request body')
        reply.code(400).send(errorResponse)
        return
      }
    } else {
      const message = 'Platform is likely invalid'
      task.end('[❌]')
      errr(`[422] ${message}`)
      reply.code(422).send(new JsonapiErrorBuilder()
        .withStatus(422)
        .withCode('MISSING_DATA')
        .withTitle(message)
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Retrieving bookmark from database ')
    const bookmark = await read_bookmark_by_id(id)
    
    if (!bookmark) {
      task.end('[❌]')
      errr(`[404] Bookmark not found with id: ${request.params.id}`)
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
    task.end('[✔️]')
    const targetPlatform = attributes.platform ?? bookmark.platform
    const targetIsPublished = attributes.is_published ?? bookmark.is_published

    if (
      targetPlatform === 'unknown'
      && targetIsPublished === true
      && Access.the(request.usr).cannot('publish.unknown.bookmark')
    ) {
      task.end('[❌]')
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withTitle('Forbidden')
        .withDetail('Only moderators and above can publish unknown bookmarks.')
        .build())
      return
    }

    task('Checking access control ')
    // Check access control
    if (Access.the(request.usr).canEdit(bookmark)) {
      task.end('[✔️]')
      task('Applying update to bookmark ')
      const updatedBookmark = await update_bookmark_by_id(id, attributes)
      if (updatedBookmark) {
        task.end('[✔️]')
        reply.code(204).send()
      } else {
        task.end('[❌]')
        errr('[500] Failed to update the bookmark')
        reply.code(500).send(new JsonapiErrorBuilder()
          .withStatus(500)
          .withCode('DATABASE_ERROR')
          .withTitle('Internal Server Error')
          .withDetail('Failed to update the bookmark.')
          .build()
        )
      }
    } else {
      task.end('[❌]')
      errr('[404] Access denied to bookmark')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .withSource({ parameter: request.params.id })
        .build())
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50013]'))
    log_err('[50013] PATCH bookmark by id error', e)
    reply.code(500).send(error_id(50013).default_500_error_response(e))
  }
}
