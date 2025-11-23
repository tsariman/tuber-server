import { FastifyReply, FastifyRequest } from 'fastify'
import { IStateContext } from '../../state/_state.common.types'
import { get_theme_mode } from '../../business.logic'
import { PrepareState } from '../../state/PrepareState'
import { bootstrap_app_state } from '../../state/bootstrap/app'
import bootstrap_theme_state, {
  bootstrap_theme_dark_state,
  bootstrap_theme_light_state
} from '../../state/bootstrap/theme'
import { bootstrap_appbar_state } from '../../state/bootstrap/appbar'
import { TJsonapiStateResponse, TStateAllIcons } from '@tuber/shared'
import { bootstrap_icons_state } from '../../state/bootstrap/icon'
import {
  bootstrap_pages_dark_state,
  bootstrap_pages_light_state,
  bootstrap_pages_state
} from '../../state/bootstrap/page'
import { bootstrap_pages_data_state } from '../../state/bootstrap/page.data'
import { bootstrap_background_state } from '../../state/bootstrap/background'
import {
  bootstrap_forms_dark_state,
  bootstrap_forms_light_state,
  bootstrap_forms_state
} from '../../state/bootstrap/form'
import {
  bootstrap_dialogs_dark_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_state
} from '../../state/bootstrap/dialog'
import { get_registry } from '../../business.logic/registry'
import { log_err } from '../../utility/logging'
import { default_500_error_response } from '../../business.logic/errors'

/** `POST /<random_prefix>` endpoint handler */
const post_bootstrap_1_state_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { usr, token, cookie } = req
  const context: IStateContext = {
    usr,
    token,
    theme: get_theme_mode(cookie),
  }
  try {
    reply.send({
      'state': {
        'app': new PrepareState(context).process(
          bootstrap_app_state
        ).get(),
        'theme': new PrepareState(context).process(
          bootstrap_theme_state
        ).get(),
        'themeLight': new PrepareState(context).process(
          bootstrap_theme_light_state
        ).get(),
        'themeDark': new PrepareState(context).process(
          bootstrap_theme_dark_state
        ).get(),
        'appbar': new PrepareState(context).process(
          bootstrap_appbar_state
        ).get(),
        'icons': new PrepareState<TStateAllIcons>(context).process(
          bootstrap_icons_state
        ).get(),
        'pages': new PrepareState(context).process(
          bootstrap_pages_state
        ).get(),
        'pagesLight': new PrepareState(context).process(
          bootstrap_pages_light_state
        ).get(),
        'pagesDark': new PrepareState(context).process(
          bootstrap_pages_dark_state
        ).get(),
        'pagesData': (await new PrepareState(context).processAsync(
          bootstrap_pages_data_state
        )).get(),
        'background': new PrepareState(context).process(
          bootstrap_background_state
        ).get(),
        'forms': new PrepareState(context).process(
          bootstrap_forms_state
        ).get(),
        'formsLight': new PrepareState(context).process(
          bootstrap_forms_light_state
        ).get(),
        'formsDark': new PrepareState(context).process(
          bootstrap_forms_dark_state
        ).get(),
        'dialogs': new PrepareState(context).process(
          bootstrap_dialogs_state
        ).get(),
        'dialogsLight': new PrepareState(context).process(
          bootstrap_dialogs_light_state
        ).get(),
        'dialogsDark': new PrepareState(context).process(
          bootstrap_dialogs_dark_state
        ).get(),
        'staticRegistry': get_registry('state'),
        ...(usr ? { 'net': {
          'name': usr.name,
          'role': usr.role,
          'token': token,
          'jwt_version': usr.jwt_version
        }} : {
          // Originally, session was null but it crashed the app
          'net': undefined,
        })
      }
    } as TJsonapiStateResponse)
  } catch (e) {
    log_err('in attempting to bootstrap state', e)
    reply.code(500).send(default_500_error_response(e))
  }
}

export default post_bootstrap_1_state_endpoint