import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { ler, log_err, task, task_end } from '../../utility/logging'
import { update_bookmark_by_id, read_bookmark_by_id } from '../../model/bookmark'
import { IBookmarkPatch } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { TPlatform } from '../../common.types'
import { get_platform_specific_validator } from './_bookmarks.common.logic'

/** `PATCH /bookmarks/:id` endpoint handler */
export default async function patch_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkPatch>,
  reply: FastifyReply
) {
  try {
    task('Checking request bookmark data... ')
    const driver = new JsonapiRequestDriver(request.body)
    const platform = driver.getMetaValues<TPlatform>('platform')
    const attributes = driver.getAttributes()
    if (!attributes) {
      task_end('Failed.\n[DEBUG][400] Missing attributes.', request.body)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
        .withTitle('Bad Request')
        .withDetail('Missing attributes')
        .build()
      )
      return
    }
    const validator = get_platform_specific_validator(attributes, platform)

    if (validator) {
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        task_end('Failed.\n[DEBUG][400] Validation error.')
        reply.code(400).send(errorResponse)
        return
      }
    } else {
      task_end('Failed.\n[DEBUG][422] Platform meta is missing or invalid.')
      reply.code(422).send(new JsonapiErrorBuilder()
        .withStatus(422)
        .withCode('MISSING_VALUE')
        .withTitle('Platform meta value is required')
        .build()
      )
      return
    }

    task_end('OK.')
    task('Retrieving bookmark from database... ')
    const bookmark = await read_bookmark_by_id(request.params.id)
    
    if (!bookmark) {
      task_end('Not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .withSource({ parameter: request.params.id })
        .build()
      )
      return
    }
    task_end('Done.')
    
    // Check access control
    if (Access.the(request.usr).canEdit(bookmark)) {
      task('Applying update... ')
      const updatedBookmark = await update_bookmark_by_id(request.params.id, attributes)
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
      task_end('Access denied.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
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
