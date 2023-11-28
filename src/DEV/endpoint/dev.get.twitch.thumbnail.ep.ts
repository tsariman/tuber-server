import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, { default_500_error_response } from '../../business.logic/jsonapi.error.builder'
import { twitch_fetch_thumbnail_url } from '../../platform/twitch'
import { $46_STATE_KEY, MSG_500_ERROR_MESSAGE } from '../../constants'
import Config from '../../config'

export default async function dev_get_twitch_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { videoid?: string }}>,
  reply: FastifyReply
) {
  const videoid = req.query.videoid
  if (!videoid) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .code('bad_request')
      .status(400)
      .title('Query parameter is required')
      .build()
    )
    return
  }
  try {
    const thumbnailUrl = await twitch_fetch_thumbnail_url(videoid)
    if (thumbnailUrl) {
      reply.code(200).send({
        'state': {
          'pagesData': {
            [$46_STATE_KEY]: { thumbnailUrl }
          }
        }
      })
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .code('not_found')
        .status(404)
        .title('not found')
        .detail('Check the video ID and try again.')
        .build()
      )
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}
