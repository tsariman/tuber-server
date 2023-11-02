import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import C from '../../config'
import { $46_KEY } from '../../constants'
import { rumble_fetch_thumbnail } from 'src/business.logic/rumble'

/** 
 * Example URL: http://localhost:8080/INSTALL.DEV/rumble/thumbnails?slug=<paste-slug-here>
 */
export default async function dev_rumble_get_thumbnail(
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
  C.log('dev_rumble_get_thumbnail:', slug)
  try {
    const thumbnailUrl = await rumble_fetch_thumbnail(slug)
    reply.code(200).send({
      'state': {
        'pagesData': {
          [$46_KEY]: {
            'imgUrl': thumbnailUrl
          }
        }
      }
    })
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