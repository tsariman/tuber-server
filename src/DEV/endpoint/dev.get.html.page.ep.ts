import { FastifyRequest, FastifyReply } from 'fastify'
import fetch from 'cross-fetch'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import Config from '../../config'
import { DEFAULT_500_ERROR_MESSAGE } from '../../constants'

export default async function dev_get_html_page_endpoint(
  req: FastifyRequest<{ Querystring: { url?: string } }>,
  reply: FastifyReply
) {
  const url = req.query.url
  if (!url) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .code('bad_request')
      .status(400)
      .title('url query parameter is required')
      .detail('url query parameter is required')
      .build()
    )
    return
  }
  Config.log('dev_get_html_page:', url)
  try {
    const response = await fetch(url)
    const html = await response.text()
    reply.send(html)
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}
