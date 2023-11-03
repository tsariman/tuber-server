import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/jsonapi.error.builder'
import { $46_KEY } from '../../constants'
import { odysee_fetch_thumbnail } from '../../business.logic/platform/odysee'

/** 
 * Example URL: http://localhost:8080/dev/odysee/thumbnails?slug=<paste-slug-here>
 */
export default async function dev_odysee_get_thumbnail(
  req: FastifyRequest<{ Querystring: { slug?: string }}>,
  reply: FastifyReply
) {
  const slug = req.query.slug
  if (!slug) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .code('bad_request')
      .status(400)
      .title('query query parameter is required')
      .detail('query query parameter is required')
      .build()
    )
    return
  }
  try {
    const thumbnailUrl = await odysee_fetch_thumbnail(slug)
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
        .detail('Check the slug and try again.')
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