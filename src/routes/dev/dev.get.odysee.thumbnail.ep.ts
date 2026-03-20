import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { odysee_fetch_thumbnail_url } from '../../platform/odysee'
import { errr, ler, log_err, task } from '../../utility/logging'
import STATE_KEY from '../../business.logic/state.key'

const $46 = STATE_KEY['46']

/** 
 * Example URL: http://localhost:8080/dev/odysee/thumbnails?slug=<paste-slug-here>
 */
export default async function dev_get_odysee_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { slug?: string }}>,
  reply: FastifyReply
) {
  task('Validating query parameter "slug" ')
  try {
    const slug = req.query.slug
    if (!slug) {
      task.end('[❌]')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Fetching Odysee thumbnail for slug '${slug}' `)
    const thumbnailUrl = await odysee_fetch_thumbnail_url(slug)
    if (thumbnailUrl) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'pagesData': {
            [$46]: { thumbnailUrl }
          }
        }
      })
    } else {
      task.end('[❌]')
      errr(`Thumbnail not found for slug '${slug}'`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('not found')
        .withDetail('Check the slug and try again.')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5019]'))
    log_err('[5019] DEV GET ODYSEE THUMBNAIL ERROR', e)
    reply.code(500).send(error_id(5019).default_500_error_response(e))
  }
}