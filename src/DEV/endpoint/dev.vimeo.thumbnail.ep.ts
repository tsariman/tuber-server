import { FastifyReply, FastifyRequest } from 'fastify'
import { $46_KEY } from '../../constants'
import JsonapiErrorBuilder from '../../business.logic/jsonapi.error.builder'
import { vimeo_fetch_thumbnail } from '../../platform/vimeo'

export default async function dev_get_vimeo_thumbnail_endpoint(
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
    const thumbnailUrl = await vimeo_fetch_thumbnail(videoid)
    if (thumbnailUrl) {
      reply.code(200).send({
        'state': {
          'pagesData': {
            [$46_KEY]: { thumbnailUrl }
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
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}