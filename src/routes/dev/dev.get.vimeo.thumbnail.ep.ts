import { FastifyReply, FastifyRequest } from 'fastify'
import { $46_STATE_KEY, MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { vimeo_fetch_thumbnail_url } from '../../platform/vimeo'
import { errr, ler, log_err, task } from '../../utility/logging'

export default async function dev_get_vimeo_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { videoid?: string }}>,
  reply: FastifyReply
) {
  task('Validating query parameter ')
  try {
    const videoid = req.query.videoid
    if (!videoid) {
      task.end('[❌]')
      errr(`'videoid' query parameter was not received`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Fetching Vimeo thumbnail for video ID '${videoid}' `)
    const thumbnailUrl = await vimeo_fetch_thumbnail_url(videoid)
    if (thumbnailUrl) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'pagesData': {
            [$46_STATE_KEY]: { thumbnailUrl }
          }
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      errr(`Thumbnail not found for video ID '${videoid}'`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('not found')
        .withDetail('Check the video ID and try again.')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5022]'))
    log_err('[5022] DEV GET VIMEO THUMBNAIL ERROR', e)
    reply.code(500).send(error_id(5022).default_500_error_response(e))
  }
}