import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { dbug, errr, ler, log_err, task, task_end } from '../../utility/logging'
import { get_video_thumbnail_url } from '../all.drivers'
import { BookmarkModel, read_bookmark_by_id } from '../../model/bookmark'
import { IBookmark } from '../../schema/bookmark'
import { TPlatform } from '../../common.types'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'

export interface IBookmarkThumbnailUrlGet {
  Params: {
    id?: string
  }
}

const jsonapi_400_reply = () => new JsonapiErrorBuilder()
  .withStatus(400)
  .withCode('MISSING_VALUE')
  .withTitle('Missing required information')
  .build()

export default async function get_video_thumbnail_url_endpoint (
  req: FastifyRequest<IBookmarkThumbnailUrlGet>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params
    if (!id) {
      errr('[400] get platform video thumbnail url')
      ler('             Bookmark id is missing.')
      reply.code(400).send(jsonapi_400_reply())
      return
    }
    task('Retrieving bookmark... ')
    const bookmark = await read_bookmark_by_id(id)
    if (!bookmark) {
      task_end('Failed.\n[DEBUG][404] Bookmark not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Bookmark not Found')
        .build()
      )
      return
    }
    task_end('Done.')
    if (bookmark.thumbnail_url) {
      dbug('[409] Bookmark already has a thumbnail url.')
      dbug('[409] thumbnail_url:', bookmark.thumbnail_url)
      reply.code(200).send(
        JsonapiResponseBuilder.forSingleResource(bookmark, 'bookmarks').build()
      )
      return
    }
    const platform: TPlatform = bookmark.platform as TPlatform
    const { videoid, slug, url } = bookmark as IBookmark
    if (!platform) {
      errr('[400] get platform video thumbnail url')
      ler('             Platform is missing. (bookmark.platform)'
                              + 'a sign of an invalid bookmark.')
      reply.code(400).send(jsonapi_400_reply())
      return
    }
    if (!videoid && (platform === 'twitch' || platform === 'vimeo')) {
      errr('[500] get platform video thumbnail url')
      ler('             Invalid bookmark. Video id is missing. (bookmark.videoid)')
      reply.code(500).send(default_500_error_response({
        message: 'Failed to retrieve thumbnail url.',
        stack: 'Existing bookmark is missing required information.'
      }))
      return
    }
    if (!slug && (platform === 'rumble' || platform === 'odysee')) {
      errr('[500] get platform video thumbnail url')
      ler('             Invalid bookmark. Slug is missing. (bookmark.slug)')
      reply.code(500).send(default_500_error_response({
        message: 'Failed to retrieve thumbnail url.',
        stack: 'Existing bookmark is missing required information.'
      }))
      return
    }
    task(`Retrieving ${platform}'s video thumbnail url... `)
    const thumbnail_url = await get_video_thumbnail_url({
      platform,
      videoid,
      slug,
      url
    })
    if (!thumbnail_url) {
      task_end(`Failed.`)
      reply.code(500).send(default_500_error_response({
        message: `Failed to retrieve video's thumbnail url.`,
        stack: `Failed to retrieve video's thumbnail url.`
      }))
      return
    }
    task_end('Done.')
    dbug('thumbnail_url:', thumbnail_url)
    task('Updating bookmark... ')
    const updatedBookmark = await BookmarkModel.findByIdAndUpdate( // Update bookmark with thumbnail url
      id,
      { thumbnail_url },
      { new: true }
    )
    if (updatedBookmark) {
      task_end('Done.')
      reply.code(200).send(
        JsonapiResponseBuilder.forSingleResource(updatedBookmark, 'bookmarks').build()
      )
    } else {
      // [TODO] [HACK] Not finding the bookmark is not just an error but a hack
      //               attempt. Log this.
      task_end('Failed.\n[DEBUG][404] Bookmark not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .build()
      )
    }
  } catch (e) {
    ler(`Failed.\n[DEBUG][500] Internal Server Error - Getting platform video thumbnail url`)
    log_err(`GET platform video thumbnail url`, e)
    reply.code(500).send(default_500_error_response(e))
  }
}