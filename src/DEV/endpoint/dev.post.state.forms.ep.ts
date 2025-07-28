import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/jsonapi.error.builder'
import DEV_STATE_FORM from '../form'
import { TNetState } from '../../common.types'
import { MSG_500_ERROR_MESSAGE } from '../../constants'

export default async function dev_post_state_forms_endpoint(
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key
    if (!key) {
      Config.log(`[ERROR] 'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('bad_request')
        .withTitle('Missing information')
      )
      return
    }
    Config.print(`[DEBUG] Loading '${key}' state... `)
    const formState = DEV_STATE_FORM[key]
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
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('not_found')
          .withTitle(`Form ${key} Not found`)
          .build(),
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        } as TNetState
      })
    }
  } catch (e) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}