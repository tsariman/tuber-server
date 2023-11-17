import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/jsonapi.error.builder'
import Config from '../../config'
import { $54_KEY, $56_KEY, DEFAULT_500_ERROR_MESSAGE } from '../../constants'
import axios from 'axios'

interface IRequestBody {
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
  req: FastifyRequest<IRequestBody>,
  reply: FastifyReply
): Promise<void> {
  const regexp = req.body.regexp
  const url = req.body.url
  if (!regexp || !url) {
    Config.log('[ERROR]: URL and regexp are required.')
    reply.code(400).send(new JsonapiErrorBuilder()
      .code('bad_request')
      .status(400)
      .title('Query parameter is required')
      .build()
    )
    return
  }
  Config.log(`Parsing ${url} with ${regexp}... `)
  try {
    const response = await axios.get(url)
    const html = await response.data
    const re = new RegExp(regexp, 'g')
    const iterator = html.matchAll(re)
    const matches = [ ...iterator ]
    if (matches) {
      Config.log('Success!')
      reply.code(200).send({
        'state': {
          'formsData': {
            [$54_KEY]: {
              'videoid': matches[1][1],
              'thumbnail_url': matches[0][2],
            }
          },
          'pagesData': {
            [$56_KEY]: { matches }
          }
        }
      })
    } else {
      Config.log('Failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .code('not_found')
        .status(404)
        .title('Invalid Rumble URL')
        .build()
      )
    }
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}