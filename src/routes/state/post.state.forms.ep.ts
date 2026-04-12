import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { errr, ler, log_err, task } from '../../utility/logging'
import {
  get_contextualized_form_state,
  get_contextualized_form_state_dark
} from '../../state/form'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse, type TStateForm } from '@tuber/shared'
import { IStatePost } from '../../common.types'
import { t, themed } from '../../business.logic'
import { read_user_by_id } from '../../model/user'
import { is_record } from '../../utility'
import Access from '../../business.logic/security/Access'
import type { TContextualUser } from '../../schema/user'
import {
  BOOKMARK_NOTE_LINK_REGEX,
  BOOKMARK_NOTE_LINKS_FIELD_MESSAGE,
  BOOKMARK_NOTE_LINKS_HELPER_TEXT,
} from '../../business.logic/security/bookmark.note.links'

const rewrite_form_state = (
  formState: TStateForm,
  rewriter: (node: Record<string, unknown>) => Record<string, unknown>
) : TStateForm => {
  const rewrite_node = (node: unknown): unknown => {
    if (!is_record(node)) { return node }

    let nextNode: Record<string, unknown> = { ...node }
    if (Array.isArray(node.items)) {
      nextNode.items = node.items.map(rewrite_node)
    }

    nextNode = rewriter(nextNode)
    return nextNode
  }

  return rewrite_node(formState) as TStateForm
}

const apply_account_patreon_context = (
  formState: TStateForm,
  linked: boolean
) : TStateForm => {
  return rewrite_form_state(formState, (node) => {
    const has = is_record(node.has) ? node.has : undefined

    if (node.type === 'state_button' && has) {
      const currentLabel = has.label
      if (currentLabel === 'Connect Patreon' || currentLabel === 'Reconnect Patreon') {
        return {
          ...node,
          has: {
            ...has,
            label: linked ? 'Reconnect Patreon' : 'Connect Patreon'
          }
        }
      }
    }

    if (node.type === 'html' && has) {
      const content = has.content
      if (typeof content === 'string' && content.includes('Status:</strong>')) {
        return {
          ...node,
          has: {
            ...has,
            content: content.replace(
              /(Status:\s*<\/strong>\s*)(Not connected|Connected)/i,
              `$1${linked ? 'Connected' : 'Not connected'}`
            )
          }
        }
      }
    }

    return node
  })
}

const apply_bookmark_note_links_context = (
  formState: TStateForm,
  usr?: TContextualUser
) : TStateForm => {
  if (Access.the(usr).can('bookmark.note.links')) {
    return formState
  }

  return rewrite_form_state(formState, (node) => {
    if (node.type !== 'textarea' || node.name !== 'note') {
      return node
    }

    const has = is_record(node.has) ? node.has : {}
    const props = is_record(node.props) ? node.props : {}

    return {
      ...node,
      props: {
        ...props,
        helperText: BOOKMARK_NOTE_LINKS_HELPER_TEXT
      },
      has: {
        ...has,
        invalidationRegex: BOOKMARK_NOTE_LINK_REGEX.source,
        invalidationMessage: t(
          'bookmark_note_links_unavailable',
          BOOKMARK_NOTE_LINKS_FIELD_MESSAGE
        )
      }
    }
  })
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
    let light = get_contextualized_form_state(key, usr)
    let dark = get_contextualized_form_state_dark(key, usr)

    light = apply_bookmark_note_links_context(light, usr)
    dark = apply_bookmark_note_links_context(dark, usr)

    if (key === 'editUserForm' && usr?._id) {
      const user = await read_user_by_id(String(usr._id))
      const linked = typeof user?.patreon_user_id === 'string'
        && user.patreon_user_id.trim() !== ''
      light = apply_account_patreon_context(light, linked)
      dark = apply_account_patreon_context(dark, linked)
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