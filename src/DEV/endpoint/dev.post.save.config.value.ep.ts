import { FastifyRequest, FastifyReply } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/jsonapi.error.builder'
import Config from '../../config'
import {
  $62_KEY,
  DEFAULT_500_ERROR_MESSAGE
} from '../../constants'

interface IPostRequest {
  Body: {
    key?: string
    value?: string
  }
}

/**
 * Save a configuration value to the database.
 *
 * @param req 
 * @param reply 
 * @returns `Promise<void>`
 */
export default async function dev_post_save_config_value_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  try {
    const key = req.body.key
    const value = req.body.value
    if (!key || !value) {
      Config.log('[ERROR]: Key and value are required.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .code('bad_request')
        .status(400)
        .title('Query parameter is required')
        .build()
      )
      return
    }
    Config.print(`Saving configuration value... `)
    await Config.save(key, value)
    Config.log('Success!')
    reply.code(200).send({
      'state': {
        'formsData': {
          [$62_KEY]: { key: '', value: '' }
        }
      }
    })
  } catch (e) {
    Config.log(`${DEFAULT_500_ERROR_MESSAGE} while saving configuration value.`, e)
    reply.code(500).send(default_500_error_response)
  }
}