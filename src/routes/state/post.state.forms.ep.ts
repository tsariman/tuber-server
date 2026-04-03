import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { errr, ler, log_err, task } from '../../utility/logging'
import {
  get_contextualized_form_state,
  get_contextualized_form_state_dark
} from '../../state/form'
import {  MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { IStatePost } from '../../common.types'
import { themed } from '../../business.logic'
import { read_user_by_id } from '../../model/user'
import { is_record } from '../../utility'

const apply_account_patreon_context = (
  formState: unknown,
  linked: boolean
) => {
  if (!is_record(formState)) { return }

  const rewrite_node = (node: unknown): unknown => {
    if (!is_record(node)) { return node }

    const nextNode: Record<string, unknown> = { ...node }
    const has = is_record(node.has) ? node.has : undefined

    if (Array.isArray(node.items)) {
      nextNode.items = node.items.map(rewrite_node)
    }

    if (node.type === 'state_button' && has) {
      const currentLabel = has.label
      if (currentLabel === 'Connect Patreon' || currentLabel === 'Reconnect Patreon') {
        nextNode.has = {
          ...has,
          label: linked ? 'Reconnect Patreon' : 'Connect Patreon'
        }
      }
    }

    if (node.type === 'html' && has) {
      const content = has.content
      if (typeof content === 'string' && content.includes('Status:</strong>')) {
        nextNode.has = {
          ...has,
          content: content.replace(
            /(Status:\s*<\/strong>\s*)(Not connected|Connected)/i,
            `$1${linked ? 'Connected' : 'Not connected'}`
          )
        }
      }
    }

    return nextNode
  }

  if (Array.isArray(formState.items)) {
    formState.items = formState.items.map(rewrite_node)
  }
}

/** `POST /state/forms` endpoint handler */
export default async function post_state_forms_endpoint (
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
    const light = get_contextualized_form_state(key, usr)
    const dark = get_contextualized_form_state_dark(key, usr)

    if (key === 'editUserForm' && usr?._id) {
      const user = await read_user_by_id(String(usr._id))
      const linked = typeof user?.patreon_user_id === 'string'
        && user.patreon_user_id.trim() !== ''
      apply_account_patreon_context(light, linked)
      apply_account_patreon_context(dark, linked)
    }

    const formState = themed(light, dark, themeMode)
    if (formState) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'forms': { [key]: formState },
          'formsLight': { [key]: light },
          'formsDark': { [key]: dark },
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      reply.code(404).send({
        'state': {
          'forms': {
            [key]: { 'items': [] }
          }
        },
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('NOT_FOUND')
          .withTitle(`Form ${key} Not found`)
          .build(),
      } as TJsonapiStateResponse)
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5039]'))
    log_err('[5039] POST state forms', e)
    reply.code(500).send(error_id(5039).default_500_error_response(e))
  }
}