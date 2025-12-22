import { FastifyReply, FastifyRequest } from 'fastify'
import { default_500_error_response } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { dbug, ler, log_err, task, task_end } from '../../utility/logging'
import { create_bookmark } from '../../model/bookmark'
import { IBookmarkPost } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import fix_missing_bookmark_data from '../../platform/all.drivers'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { get_platform_specific_validator } from './_bookmarks.common.logic'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import Access from '../../business.logic/security/Access'
import CLEARANCE_LEVEL from '../../business.logic/security/clearance.level'

/** `POST /bookmarks` endpoint handler */
export default async function post_bookmark_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  try {
    const accessingUser = Access.the(req.usr)
    if (accessingUser.cannot('create.bookmark')) {
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withTitle('Forbidden')
        .withDetail('You do not have permission to create bookmarks')
        .build())
      return
    }

    task('Checking bookmark data... ')
    const driver = new JsonapiRequestDriver(req.body)
    const newBookmarkData = driver.getAttributes()
    if (!newBookmarkData) {
      task_end(`Faild.\n[DEBUG][400] Missing Request attributes`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('The request format is invalid')
        .build())
      return
    }
    
    const validator = get_platform_specific_validator(newBookmarkData)
    if (validator) {
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        task_end('Failed.\n[DEBUG][400] Validation error.')
        reply.code(400).send(errorResponse)
        return
      }
    } else {
      const message = 'Platform is likely invalid'
      task_end(`Failed.\n[DEBUG][400] ${message}.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle(message)
        .build())
      return
    }

    task_end('Ok.')

    task(`Creating [${newBookmarkData.platform}] bookmark... `)
    const fixedBookmarkData = await fix_missing_bookmark_data(
      newBookmarkData,
      req.usr
    )
    if (!fixedBookmarkData) {
      task_end('Failed.\n[ERROR][500] in bookmark data-fixing-processes.')
      reply.code(500).send(default_500_error_response({
        title: 'Failed to fix bookmark missing data',
        detail: 'Bookmark is null.'
      }))
      return
    }
    fixedBookmarkData.inception_clearance = CLEARANCE_LEVEL[accessingUser.role]
    const dbBookmark = await create_bookmark(fixedBookmarkData)
    task_end('Done.')
    dbug('Sending response...', dbBookmark)
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks').build()
    )
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('POST bookmark', e)
    reply.code(500).send(default_500_error_response(e))
  }
}