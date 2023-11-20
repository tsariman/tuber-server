import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import STATE_DIALOGS from '../dialog'
import { TNetState, TStateAllDialogs } from '../../common.types'
import { DEFAULT_500_ERROR_MESSAGE } from 'src/constants'

export default async function post_state_dialogs_endpoint (
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key
    if (!key) {
      Config.log(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Missing information')
      )
      return
    }
    Config.print(`Loading '${key}' state... `)
    const dialogState = STATE_DIALOGS[key]
    if (dialogState) {
      Config.log('Done.')
      reply.code(200).send({
        state: {
          'dialogs': { [key]: dialogState }
        } as TNetState
      })
    } else {
      Config.log('Failed.')
      reply.code(404).send({
        state: {
          'dialogs': {
            [key]: {
              '_key': key,
              'title': 'Dialog not found',
              'open': false,
            }
          } as TStateAllDialogs
        },
        ...new JsonapiErrorBuilder()
          .status(404)
          .code('not_found')
          .title(`Dialog ${key} Not found`)
          .build(),
      })
    }
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}