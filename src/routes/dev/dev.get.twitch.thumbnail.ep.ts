import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { twitch_fetch_thumbnail_url } from '../../platform/twitch'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { errr, ler, log_err, task } from '../../utility/logging'
import STATE_KEY from '../../business.logic/state.key'

const $46 = STATE_KEY['46']

export default async function dev_get_twitch_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { videoid?: string }}>,
  reply: FastifyReply
) {
  task('Validating query parameter ')
  try {
    const videoid = req.query.videoid
    if (!videoid) {
      task.end('[❌]')
      errr('Query parameter "videoid" was not received.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Fetching Twitch thumbnail for video ID '${videoid}' `)
    const thumbnailUrl = await twitch_fetch_thumbnail_url(videoid)
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
      errr(`Thumbnail not found for video ID '${videoid}'`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('Not found')
        .withDetail('Check the video ID and try again.')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5021]'))
    log_err('[5021] DEV GET TWITCH THUMBNAIL ERROR', e)
    reply.code(500).send(error_id(5021).default_500_error_response(e))
  }
}
