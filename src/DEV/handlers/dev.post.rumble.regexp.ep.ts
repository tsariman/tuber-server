import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder';
import { default_500_error_response } from '../../business.logic/errors'
import { log } from '../../utility/logging';
import {
  $54_STATE_KEY,
  $56_STATE_KEY,
  MSG_500_ERROR_MESSAGE
} from '@tuber/shared';
import axios from 'axios';

interface IPostRequest {
  Body: {
    regexp?: string;
    url?: string;
  };
}

/**
 * Use the regexp to extract the data from the HTML page which is fetched from
 * the URL.
 *
 * @param req 
 * @param reply 
 * @returns `Promise<void>`
 */
export default async function dev_post_rumble_regexp_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  const regexp = req.body.regexp;
  const url = req.body.url;
  if (!regexp || !url) {
    log('[ERROR]: URL and regexp are required.');
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_VALUE')
      .withStatus(400)
      .withTitle('Query parameter is required')
      .build()
    )
    return;
  }
  log(`[DEBUG] Parsing ${url} with ${regexp}... `);
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      validateStatus: (status) => status >= 200 && status < 400
    });
    const html = await response.data;
    const re = new RegExp(regexp, 'g');
    const iterator = html.matchAll(re);
    const matches = [ ...iterator ];
    if (matches) {
      log('Success!');
      reply.code(200).send({
        'state': {
          'formsData': {
            [$54_STATE_KEY]: {
              'videoid': matches[1][1],
              'thumbnail_url': matches[0][2],
            }
          },
          'pagesData': {
            [$56_STATE_KEY]: { matches }
          }
        }
      });
    } else {
      log('Failed.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('RESOURCE_NOT_FOUND')
        .withStatus(404)
        .withTitle('Invalid Rumble URL')
        .build()
      );
    }
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}