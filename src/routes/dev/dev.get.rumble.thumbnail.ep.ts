import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { $46_STATE_KEY, MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { rumble_fetch_thumbnail_url } from '../../platform/rumble'
import { errr, ler, log_err, task } from '../../utility/logging'

/** 
 * Example URL: http://localhost:8080/dev/rumble/thumbnails?slug=<paste-slug-here>
 */
export default async function dev_get_rumble_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { slug?: string }}>,
  reply: FastifyReply
) {
  task('Validating query parameter "slug"')
  try {
    const slug = req.query.slug
    if (!slug) {
      task.end('[❌]')
      errr('Query parameter "slug" was not received.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Fetching Rumble thumbnail for slug '${slug}' `)
    const thumbnailUrl = await rumble_fetch_thumbnail_url(slug)
    if (thumbnailUrl) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'pagesData': {
            [$46_STATE_KEY]: { thumbnailUrl }
          }
        }
      })
    } else {
      task.end('[❌]')
      errr(`Thumbnail not found for slug '${slug}'`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('Not found')
        .withDetail('Check the slug and try again.')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5020]'))
    log_err('[5020] DEV GET RUMBLE THUMBNAIL ERROR', e)
    reply.code(500).send(error_id(5020).default_500_error_response(e))
  }
}