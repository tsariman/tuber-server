import { FastifyReply, FastifyRequest } from 'fastify'
import { error_id } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { dbug, ler, log_err, task } from '../../utility/logging'
import { create_bookmark, transform_to_bookmark } from '../../model/bookmark'
import { IBookmarkPost } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import fix_missing_bookmark_data from '../../platform/all.drivers'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { get_platform_specific_validator } from './_bookmarks.common.logic'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import Access from '../../business.logic/security/Access'
import CLEARANCE_LEVEL from '../../business.logic/security/clearance.level'
import { validate_bookmark_note_link_access } from '../../business.logic/security/bookmark.note.links'

/** `POST /bookmarks` endpoint handler */
export default async function post_bookmark_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  task('Checking user access ')
  try {
    const accessingUser = Access.the(req.usr)
    if (accessingUser.cannot('create.bookmark')) {
      task.end('[❌]')
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withTitle('Forbidden')
        .withDetail('You do not have permission to create bookmarks')
        .build())
      return
    }
    task.end('[✔️]')
    task('Checking bookmark data ')
    const driver = new JsonapiRequestDriver(req.body)
    const newBookmarkData = driver.getAttributes()
    if (!newBookmarkData) {
      task.end('[❌]')
      dbug('[400] Missing request attributes.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('The request format is invalid')
        .build())
      return
    }

    const noteLinkAccessError = validate_bookmark_note_link_access(
      newBookmarkData.note,
      req.usr
    )
    if (noteLinkAccessError) {
      task.end('[❌]')
      reply.code(403).send(noteLinkAccessError)
      return
    }
    
    const validator = get_platform_specific_validator(newBookmarkData)
    if (validator) {
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        task.end('[❌]')
        dbug('[400] Validation error.')
        reply.code(400).send(errorResponse)
        return
      }
    } else {
      const message = 'Platform is likely invalid'
      task.end('[❌]')
      dbug(`[400] ${message}.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle(message)
        .build())
      return
    }

    if (
      newBookmarkData.platform === 'unknown'
      && newBookmarkData.is_published === true
      && accessingUser.cannot('publish.unknown.bookmark')
    ) {
      task.end('[❌]')
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withTitle('Forbidden')
        .withDetail('Only moderators and above can publish unknown bookmarks.')
        .build())
      return
    }

    task.end('[✔️]')

    const fixedBookmarkData = await fix_missing_bookmark_data(
      newBookmarkData,
      req.usr
    )
    if (!fixedBookmarkData) {
      reply.code(500).send(error_id(5014).default_500_error_response({
        title: 'Failed to fix bookmark missing data',
        detail: 'Bookmark is null.'
      }))
      return
    }
    fixedBookmarkData.inception_clearance = CLEARANCE_LEVEL[accessingUser.role]
    task('Creating bookmark in database ')
    const dbBookmark = await create_bookmark(fixedBookmarkData)
    task.end('[✔️]')
    const response = JsonapiResponseBuilder.forSingleResource(
      transform_to_bookmark(dbBookmark),
      'bookmarks'
    ).withId(dbBookmark._id).build()
    dbug('Sending response...', response)
    reply.code(201).send(response)
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5015]'))
    log_err('[5015] POST bookmark', e)
    reply.code(500).send(error_id(5015).default_500_error_response(e))
  }
}