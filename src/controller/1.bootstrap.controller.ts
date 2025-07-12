import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  get_body as get_from_body,
  get_theme_mode,
  parse_cookie
} from 'src/business.logic';
import { default_500_error_response } from 'src/business.logic/jsonapi.error.builder';
import { IBootstrapResponse, TNetState, TObj } from 'src/common.types';
import Config from 'src/config';
import { TCipheredUser } from 'src/schema/users';
import { IStateContext } from 'src/state/_state.common.types';
import { bootstrap_background_state } from 'src/state/bootstrap/background';
import { bootstrap_app_state } from 'src/state/bootstrap/app';
import {
  bootstrap_theme_state,
  bootstrap_theme_light_state,
  bootstrap_theme_dark_state
} from 'src/state/bootstrap/theme';
import { bootstrap_appbar_state } from 'src/state/bootstrap/appbar';

import {
  bootstrap_dialogs_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_dark_state
} from 'src/state/bootstrap/dialog';
import {
  bootstrap_forms_state,
  bootstrap_forms_light_state,
  bootstrap_forms_dark_state
} from 'src/state/bootstrap/form';
import {
  bootstrap_pages_state,
  bootstrap_pages_light_state,
  bootstrap_pages_dark_state
} from 'src/state/bootstrap/page';
import { bootstrap_pages_data_state } from 'src/state/bootstrap/page.data';
import { PrepareState } from 'src/state/PrepareState';

export default async function $1_bootstrap_controller(fastify: FastifyInstance) {
  
  fastify.post('/', async function (
    req: FastifyRequest<{ Body: { cookie?: string } }>,
    reply: FastifyReply
  ) {
    let token = '';
    const cookie = get_from_body(req, 'cookie', '');

    if (cookie) {
      Config.log('[DEBUG] req.body.cookie:', cookie);
      token = parse_cookie(cookie).token;
      if (!token) {
        Config.log(`[DEBUG] Token is missing.`);
      }
    } else {
      Config.log('[DEBUG] No cookie received.');
    }

    let usr: TCipheredUser | undefined;

    try {
      usr = await req.jwtVerify<TCipheredUser>();
      Config.log('[DEBUG] Decoded values from token:', usr);
    } catch (err: any) {
      Config.log('[DEBUG] Token verification failed.', err.message);
    }

    const context: IStateContext = {
      usr,
      token,
      theme: get_theme_mode(cookie),
    };

    try {
      reply.send({
        'state': {
          'app': new PrepareState(context)
                      .process(bootstrap_app_state)
                      .get(),
          'theme': new PrepareState(context)
                        .process(bootstrap_theme_state)
                        .get(),
          'themeLight': new PrepareState(context)
                            .process(bootstrap_theme_light_state)
                            .get(),
          'themeDark': new PrepareState(context)
                            .process(bootstrap_theme_dark_state)
                            .get(),
          'appbar': new PrepareState(context)
                        .process(bootstrap_appbar_state)
                        .get(),
          'pages': new PrepareState(context)
                        .process(bootstrap_pages_state)
                        .get(),
          'pagesLight': new PrepareState(context)
                            .process(bootstrap_pages_light_state)
                            .get(),
          'pagesDark': new PrepareState(context)
                            .process(bootstrap_pages_dark_state)
                            .get(),
          'pagesData': (await new PrepareState<TObj>(context)
                                    .processAsync(bootstrap_pages_data_state))
                                    .get(),
          'background': new PrepareState(context)
                              .process(bootstrap_background_state)
                              .get(),
          'forms': new PrepareState(context)
                        .process(bootstrap_forms_state)
                        .get(),
          'formsLight': new PrepareState(context)
                              .process(bootstrap_forms_light_state)
                              .get(),
          'formsDark': new PrepareState(context)
                            .process(bootstrap_forms_dark_state)
                            .get(),
          'dialogs': new PrepareState(context)
                          .process(bootstrap_dialogs_state)
                          .get(),
          'dialogsLight': new PrepareState(context)
                                .process(bootstrap_dialogs_light_state)
                                .get(),
          'dialogsDark': new PrepareState(context)
                              .process(bootstrap_dialogs_dark_state)
                              .get(),
          'stateRegistry': Config.getRegistry('state'),
          ...(usr ? { 'net': {
            'name': usr.name,
            'role': usr.role,
            'token': token,
            'jwt_version': usr.jwt_version
          }} : {
            // Originally, session was null but it crashed the app
            'net': undefined,
          })
        } as TNetState
      } as IBootstrapResponse);
    } catch (err) {
      console.error(err);
      reply.code(500).send(default_500_error_response(err));
    }
  });
    
}