import { FastifyRequest, FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import Config from '../../config'
import {
  CONF_TWITCH_CLIENT_ID,
  CONF_TWITCH_CLIENT_SECRET,
  MSG_500_ERROR_MESSAGE,
  TJsonapiStateResponse,
} from '@tuber/shared'
import { errr, ler, log_err, task } from '../../utility/logging'
import STATE_KEY from '../../business.logic/state.key'

const $60 = STATE_KEY['60']

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
  task('Validating request body ')
  try {
    const clientId = req.body.client_id
    const clientSecret = req.body.client_secret
    if (!clientId || !clientSecret) {
      task.end('[❌]')
      errr('Client ID and Secret are required.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Saving Twitch Client ID and Secret `)
    await Config.save(CONF_TWITCH_CLIENT_ID, clientId)
    await Config.save(CONF_TWITCH_CLIENT_SECRET, clientSecret)
    task.end('[✔️]')
    reply.code(200).send({
      'state': {
        'formsData': {
          [$60]: { client_id: '', client_secret: '' }
        }
      }
    } as TJsonapiStateResponse)
  } catch (e) {
    ler(`${MSG_500_ERROR_MESSAGE.replace('[500]', '[50029]')} while saving Twitch Client ID and Secret.`)
    log_err('[50029] DEV POST Twitch Client ID endpoint', e)
    reply.code(500).send(error_id(50029).default_500_error_response(e))
  }
}