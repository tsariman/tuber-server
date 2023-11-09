import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import Config from 'src/config'
import { INetState } from '../../../../tuber-client/src/controllers/interfaces/IState'
import STATE_FORMS from '../form'

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
        } as INetState
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
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}