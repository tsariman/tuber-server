import { FastifyRequest, FastifyReply } from 'fastify'
import fetch from 'cross-fetch'
import JsonapiErrorBuilder from '../../business.logic/jsonapi.error.builder'
import C from '../../config'

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
  C.log('dev_get_html_page:', url)
  try {
    const response = await fetch(url)
    const html = await response.text()
    reply.send(html)
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
