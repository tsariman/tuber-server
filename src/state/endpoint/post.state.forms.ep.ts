import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import Config from '../../config'
import STATE_FORMS, { STATE_FORMS_THEME_DARK } from '../form'
import { TNetState } from '../../common.types'
import { MSG_500_ERROR_MESSAGE } from '../../constants'
import { tt } from '../../business.logic'

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
    const formState = tt(key, STATE_FORMS, STATE_FORMS_THEME_DARK)
    if (formState) {
      Config.log('Done.')
      reply.code(200).send({
        state: {
          'forms': { [key]: formState }
        } as TNetState
      })
    } else {
      Config.log('Failed.')
      reply.code(404).send({
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        },
        ...new JsonapiErrorBuilder()
          .status(404)
          .code('not_found')
          .title(`Form ${key} Not found`)
          .build(),
      })
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}