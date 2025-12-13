import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { errr, ler, task, task_end } from '../../utility/logging'
import {
  $57_STATE_KEY,
  $58_STATE_KEY,
  MSG_500_ERROR_MESSAGE,
  TNetState
} from '@tuber/shared'
import axios from 'axios'

interface IPostRequest {
  Body: {
    regexp?: string
    url?: string
  }
}

/**
 * Use the regexp to extract the data from the HTML page which is fetched from
 * the URL.
 *
 * @param req 
 * @param reply 
 * @returns `Promise<void>`
 */
export default async function dev_post_unknown_regexp_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  const regexp = req.body.regexp
  const url = req.body.url
  if (!regexp || !url) {
    errr('URL and regexp are required.')
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_DATA')
      .withStatus(400)
      .withTitle('Query parameter is required')
      .build()
    )
    return
  }
  task(`Parsing ${url} with ${regexp}... `)
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      validateStatus: (status) => status >= 200 && status < 400
    })
    const html = await response.data
    const re = new RegExp(regexp, 'g')
    const iterator = html.matchAll(re)
    const matches = [ ...iterator ]
    if (matches) {
      task_end('Success!')
      const thumbnailUrl = matches[0][1]
      reply.code(200).send({
        'state': {
          'formsData': {
            [$57_STATE_KEY]: { thumbnail_url: thumbnailUrl }
          },
          'pagesData': {
            [$58_STATE_KEY]: { matches, thumbnailUrl }
          }
        }
      } as TNetState)
    } else {
      task_end('Failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('Invalid Unknown URL')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}