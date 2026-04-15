import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { dbug, errr, ler, log_err, task } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import axios from 'axios'
import STATE_KEY from '../../business.logic/state.key'

const $54 = STATE_KEY['54']
const $56 = STATE_KEY['56']

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
export default async function dev_post_rumble_regexp_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  task('Validating request body ')
  const regexp = req.body.regexp
  const url = req.body.url
  if (!regexp || !url) {
    task.end('[❌]')
    errr('Request body parameters "url" and "regexp" are required')
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_DATA')
      .withStatus(400)
      .withTitle('Request body parameters "url" and "regexp" are required')
      .build()
    )
    return
  }
  task.end('[✔️]')
  task(`Fetching ${url} `)
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
    task.end('[✔️]')
    task(`Parsing ${url} with ${regexp} `)
    const re = new RegExp(regexp, 'g')
    const iterator = html.matchAll(re)
    const matches = [ ...iterator ]
    if (matches) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'formsData': {
            [$54]: {
              'videoid': matches[1][1],
              'thumbnail_url': matches[0][2],
            }
          },
          'pagesData': {
            [$56]: { matches }
          }
        }
      })
    } else {
      task.end('[❌]')
      dbug('No matches found')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('Invalid Rumble URL')
        .withDetail('No matches were found using the provided "regexp" on the HTML fetched from the "url".')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50025]'))
    log_err('[50025] DEV POST RUMBLE REGEXP ERROR', e)
    reply.code(500).send(error_id(50025).default_500_error_response(e))
  }
}