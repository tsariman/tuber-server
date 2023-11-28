import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/jsonapi.error.builder'
import Config from '../../config'
import {
  $57_STATE_KEY,
  $58_STATE_KEY,
  MSG_500_ERROR_MESSAGE
} from '../../constants'
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
    Config.log('[ERROR]: URL and regexp are required.')
    reply.code(400).send(new JsonapiErrorBuilder()
      .code('bad_request')
      .status(400)
      .title('Query parameter is required')
      .build()
    )
    return
  }
  Config.print(`Parsing ${url} with ${regexp}... `)
  try {
    const response = await axios.get(url)
    const html = await response.data
    const re = new RegExp(regexp, 'g')
    const iterator = html.matchAll(re)
    const matches = [ ...iterator ]
    if (matches) {
      Config.log('Success!')
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
      })
    } else {
      Config.log('Failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .code('not_found')
        .status(404)
        .title('Invalid Unknown URL')
        .build()
      )
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}