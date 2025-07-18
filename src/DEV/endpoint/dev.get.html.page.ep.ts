import { FastifyRequest, FastifyReply } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/jsonapi.error.builder'
import Config from '../../config'
import { MSG_500_ERROR_MESSAGE } from '../../constants'
import axios from 'axios'

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
  Config.log('[DEBUG] dev_get_html_page:', url)
  try {
    const response = await axios.get(url)
    const html = await response.data
    reply.send(html)
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}
