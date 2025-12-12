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
import { TPlatform } from '../../common.types'

/** `POST /bookmarks` endpoint handler */
export default async function post_bookmark_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  try {
    const driver = new JsonapiRequestDriver(req.body)
    const newBookmarkData = driver.getAttributes()
    if (!newBookmarkData) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('INVALID_FORMAT')
        .withTitle('The request format is invalid')
      )
      return
    }
    const platform = driver.getAttribute('platform') as TPlatform
    if (!platform) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
        .withTitle('Missing "platform" value')
        .build()
      )
      return
    }
    
    const validator = get_platform_specific_validator(newBookmarkData, platform)
    if (validator) {
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        reply.code(400).send(errorResponse)
        return
      }
    }

    task(`Creating [${platform}] bookmark... `)
    const bookmark = await fix_missing_bookmark_data(newBookmarkData, req.usr)
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
    task_end('Done.')
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('POST bookmark', e)
    reply.code(500).send(default_500_error_response(e))
  }
}