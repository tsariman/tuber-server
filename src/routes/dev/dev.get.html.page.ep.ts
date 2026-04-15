import { FastifyRequest, FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { errr, ler, log_err, task } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import axios from 'axios'

export default async function dev_get_html_page_endpoint(
  req: FastifyRequest<{ Querystring: { url?: string } }>,
  reply: FastifyReply
) {
  task('Validating query parameter "url" ')
  try {
    const url = req.query.url
    if (!url) {
      task.end('[❌]')
      errr('Query parameter "url" was not received.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('url query parameter is required')
        .withDetail('url query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Fetching HTML page for URL '${url}' `)
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      validateStatus: (status) => status >= 200 && status < 400
    })
    const html = await response.data
    task.end('[✔️]')
    reply.send(html)
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50018]'))
    log_err('[50018] DEV GET HTML PAGE ERROR', e)
    reply.code(500).send(error_id(50018).default_500_error_response(e))
  }
}
