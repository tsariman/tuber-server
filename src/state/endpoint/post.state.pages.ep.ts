import { FastifyReply, FastifyRequest } from 'fastify';
import { ler, log, log_err, write } from '../../utility/logging';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/jsonapi.error.builder';
import  { STATE_PAGES, STATE_PAGES_THEME_DARK } from '../page';
import { TJsonapiStateResponse } from '../../shared';
import { TThemeMode } from '../../common.types';
import { MSG_500_ERROR_MESSAGE } from '../../constants.server';
import { themed } from '../../business.logic';

export default async function post_state_pages_endpoint (
  req: FastifyRequest<{ Body: { key?: string, mode?: TThemeMode }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key;
    const mode = req.body.mode;
    if (!key) {
      log(`[ERROR] 'key' was not received.`);
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('bad_request')
        .withTitle('Missing information')
      );
      return;
    }
    if (!mode) {
      log(`[ERROR] 'mode' was not received.`);
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('bad_request')
        .withTitle('Missing information')
      );
      return;
    }
    write(`[DEBUG] Loading '${key}' state... `);
    const light = STATE_PAGES[key];
    const dark = STATE_PAGES_THEME_DARK[key];
    const pageState = themed(light, dark, mode);
    if (pageState) {
      log('Done.');
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: STATE_PAGES[key] },
          'pagesDark': { [key]: STATE_PAGES_THEME_DARK[key] },
        }
      } as TJsonapiStateResponse);
    } else {
      log('Failed.');
      reply.code(404).send({
        state: {
          'pages': {
            [key]: {
              'appbarInherited': 'default-notfound',
              'contentInherited': 'default-notfound',
              'layout': 'layout_centered',
              'data': { 'message': `Page not found!` },
            }
          }
        }
      } as TJsonapiStateResponse);
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('POST state page', e);
    reply.code(500).send(default_500_error_response(e));
  }
}