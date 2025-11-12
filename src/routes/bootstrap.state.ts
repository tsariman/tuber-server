import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { parse_cookie } from '../utility'
// import { randomBytes } from 'crypto'
import { get_from_body, get_theme_mode } from '../business.logic'
import { default_500_error_response } from '../business.logic/errors'
import { TJsonapiStateResponse, TStateAllIcons } from '@tuber/shared'
import { TCipheredUser } from '../schema/users'
import { IStateContext } from '../state/_state.common.types'
import { bootstrap_background_state } from '../state/bootstrap/background'
import { bootstrap_app_state } from '../state/bootstrap/app'
import {
  bootstrap_theme_state,
  bootstrap_theme_light_state,
  bootstrap_theme_dark_state
} from '../state/bootstrap/theme'
import { bootstrap_appbar_state } from '../state/bootstrap/appbar'
import {
  bootstrap_dialogs_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_dark_state
} from '../state/bootstrap/dialog'
import {
  bootstrap_forms_state,
  bootstrap_forms_light_state,
  bootstrap_forms_dark_state
} from '../state/bootstrap/form'
import {
  bootstrap_pages_state,
  bootstrap_pages_light_state,
  bootstrap_pages_dark_state
} from '../state/bootstrap/page'
import { bootstrap_pages_data_state } from '../state/bootstrap/page.data'
import { PrepareState } from '../state/PrepareState'
import { bootstrap_icons_state } from '../state/bootstrap/icon'
import { get_registry } from '../business.logic/registry'
import { log, log_err } from '../utility/logging'
import Config from '../config'

// Global variable to store the current bootstrap prefix
let BOOTSTRAP_PREFIX: string = ''

export function get_bootstrap_key(): string {
  return BOOTSTRAP_PREFIX
}

export function get_server_domain(): string {
  return Config.DOMAIN || '127.0.0.1:8080'
}

export function get_client_domain(): string {
  return process.env.CLIENT_DOMAIN || 'http://localhost:3000'
}

const bootstrap_state: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  
   // Generate a random prefix for the bootstrap controller per session
  const randomPrefix =  '3dad18f2d7bf2214a082c735880bcde9' // randomBytes(16).toString('hex')
  BOOTSTRAP_PREFIX = randomPrefix

  // Log the bootstrap prefix for debugging (remove in production)
  console.log('[INFO] Bootstrap prefix generated:', randomPrefix)

  fastify.post(`/${randomPrefix}`, async function (
    req: FastifyRequest<{ Body: { cookie?: string } }>,
    reply: FastifyReply
  ) {
    let token = ''
    const cookie = get_from_body(req, 'cookie', '')

    if (cookie) {
      token = parse_cookie(cookie).token
      if (!token) {
        log(`[DEBUG] Token is missing.`)
      }
    } else {
      log('[DEBUG] No cookie received.')
    }

    let usr: TCipheredUser | undefined

    try {
      usr = await req.jwtVerify<TCipheredUser>()
      log('[DEBUG] Decoded values from token:', usr)
    } catch (e) {
      log('[DEBUG] Token verification failed.', (e as Error).message)
    }

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
  })
    
}

export default bootstrap_state