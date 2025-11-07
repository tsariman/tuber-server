import { FastifyRequest, FastifyReply } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/JsonapiErrorBuilder';
import { log } from '../../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import axios from 'axios';

export default async function dev_get_html_page_endpoint(
  req: FastifyRequest<{ Querystring: { url?: string } }>,
  reply: FastifyReply
) {
  const url = req.query.url;
  if (!url) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_VALUE')
      .withStatus(400)
      .withTitle('url query parameter is required')
      .withDetail('url query parameter is required')
      .build()
    )
    return;
  }
  log('[DEBUG] dev_get_html_page:', url);
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      validateStatus: (status) => status >= 200 && status < 400
    })
    const html = await response.data;
    reply.send(html);
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}
