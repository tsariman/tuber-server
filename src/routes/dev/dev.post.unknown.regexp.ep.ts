import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { dbug, ler, log_err, task } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import axios from 'axios'
import STATE_KEY from '../../business.logic/state.key'

const $57 = STATE_KEY['57']
const $58 = STATE_KEY['58']

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
  task('Validating request body ')
  const regexp = req.body.regexp
  const url = req.body.url
  if (!regexp || !url) {
    task.end('[❌]')
    dbug('URL and regexp are required.')
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_DATA')
      .withStatus(400)
      .withTitle('Query parameter is required')
      .build()
    )
    return
  }
  task.end('[✔️]')
  task(`Parsing ${url} with ${regexp} `)
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
      task.end('[✔️]')
      const thumbnailUrl = matches[0][1]
      reply.code(200).send({
        'state': {
          'formsData': {
            [$57]: { thumbnail_url: thumbnailUrl }
          },
          'pagesData': {
            [$58]: { matches, thumbnailUrl }
          }
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      dbug('No matches found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('Invalid Unknown URL')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50030]'))
    log_err('[50030] DEV POST unknown regexp endpoint', e)
    reply.code(500).send(error_id(50030).default_500_error_response(e))
  }
}