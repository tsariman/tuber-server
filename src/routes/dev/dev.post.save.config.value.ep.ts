import { FastifyRequest, FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import Config from '../../config'
import {
  $62_STATE_KEY,
  MSG_500_ERROR_MESSAGE,
  TJsonapiStateResponse
} from '@tuber/shared'
import { TJsonapiRequest } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { errr, ler, log_err, task } from '../../utility/logging'

interface IPostRequest {
  Body: TJsonapiRequest<{
    key?: string
    value?: string
  }>
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
  task('Validating request body ')
  try {
    const driver = new JsonapiRequestDriver(req.body)
    const key = driver.getAttribute('key')
    const value = driver.getAttribute('value')

    if (!key || !value) {
      task.end('[❌]')
      errr('Key and value are required.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('MISSING_DATA')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task(`Saving configuration value... `)
    await Config.save(key, value)
    task.end('[✔️]')
    reply.code(200).send({
      'state': {
        'formsData': {
          [$62_STATE_KEY]: { key: '', value: '' }
        }
      }
    } as TJsonapiStateResponse)
  } catch (e) {
    ler(`${MSG_500_ERROR_MESSAGE.replace('[500]', '[5026]')} while saving configuration value.`)
    log_err('[5026] DEV POST SAVE CONFIG VALUE ERROR', e)
    reply.code(500).send(error_id(5026).default_500_error_response(e))
  }
}