import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, {
  generic_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import Config from '../../config'
import STATE_FORMS from '../form'
import { TNetState } from '../../common.types'

export default async function post_state_forms_endpoint (
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
    const formState = STATE_FORMS[key]
    if (formState) {
      Config.log('done.')
      reply.code(200).send({
        state: {
          'forms': { [key]: formState }
        } as TNetState
      })
    } else {
      Config.log('failed.')
      reply.code(404).send({
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        }
      })
    }
  } catch (e: any) {
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(generic_500_error_response(e))
  }
}