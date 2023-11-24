import { FastifyRequest, FastifyReply } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/jsonapi.error.builder'
import Config from '../../config'
import {
  $60_KEY,
  CONF_TWITCH_CLIENT_ID,
  CONF_TWITCH_CLIENT_SECRET,
  DEFAULT_500_ERROR_MESSAGE
} from '../../constants'

interface IPostRequest {
  Body: {
    client_id?: string
    client_secret?: string
  }
}

/**
 * Save the Twitch Client ID and Secret to the database.
 *
 * @param req 
 * @param reply 
 * @returns `Promise<void>`
 */
export default async function dev_post_twitch_client_id_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  try {
    const clientId = req.body.client_id
    const clientSecret = req.body.client_secret
    if (!clientId || !clientSecret) {
      Config.log('[ERROR]: Client ID and Secret are required.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .code('bad_request')
        .status(400)
        .title('Query parameter is required')
        .build()
      )
      return
    }
    Config.print(`Saving Twitch Client ID and Secret... `)
    await Config.save(CONF_TWITCH_CLIENT_ID, clientId)
    await Config.save(CONF_TWITCH_CLIENT_SECRET, clientSecret)
    Config.log('Success!')
    reply.code(200).send({
      'state': {
        'formsData': {
          [$60_KEY]: { client_id: '', client_secret: '' }
        }
      }
    })
  } catch (e) {
    Config.log(`${DEFAULT_500_ERROR_MESSAGE} while saving Twitch Client ID`
      + ` and Secret.`, e)
    reply.code(500).send(default_500_error_response)
  }
}