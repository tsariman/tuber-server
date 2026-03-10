import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import  {
  get_contextualized_dialog_state,
  get_contextualized_dialog_state_dark
} from '../../state/dialog'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { themed } from '../../business.logic'
import { errr, ler, log_err, task } from '../../utility/logging'
import { IStatePost } from '../../common.types'

/** `POST /state/dialogs` endpoint handler */
export default async function post_state_dialogs_endpoint (
  req: FastifyRequest<IStatePost>,
  reply: FastifyReply
) {
  try {
    const { body: { key, theme_mode: themeMode }, usr } = req
    if (!key) {
      errr(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Missing information')
      )
      return
    }
    if (!themeMode) {
      errr(`'theme_mode' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Missing information')
      )
      return
    }
    task(`Loading '${key}' state with theme mode '${themeMode}' `)
    const light = get_contextualized_dialog_state(key, usr)
    const dark = get_contextualized_dialog_state_dark(key, usr)
    const dialogState = themed(light, dark, themeMode)
    if (dialogState) {
      task.end('[✔️]')
      reply.code(200).send({
        state: {
          'dialogs': { [key]: dialogState },
          'dialogsLight': { [key]: light },
          'dialogsDark': { [key]: dark },
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      reply.code(404).send({
        state: {
          'dialogs': {
            [key]: {
              '_key': key,
              'title': 'Dialog not found',
              'open': false,
            }
          }
        },
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('NOT_FOUND')
          .withTitle(`Dialog ${key} Not found`)
          .build(),
      } as TJsonapiStateResponse)
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5038]'))
    log_err('[5038] POST state dialogs', e)
    reply.code(500).send(error_id(5038).default_500_error_response(e))
  }
}