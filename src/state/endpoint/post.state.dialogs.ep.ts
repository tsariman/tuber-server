import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/jsonapi.error.builder';
import  { STATE_DIALOGS, STATE_DIALOGS_THEME_DARK } from '../dialog';
import { TNetState, TStateAllDialogs, TThemeMode } from '../../common.types';
import { MSG_500_ERROR_MESSAGE } from 'src/constants';
import { themed } from '../../business.logic';
import { log, write } from '../../config';

export default async function post_state_dialogs_endpoint (
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
    const light = STATE_DIALOGS[key];
    const dark = STATE_DIALOGS_THEME_DARK[key];
    const dialogState = themed(light, dark, mode);
    if (dialogState) {
      log('Done.');
      reply.code(200).send({
        state: {
          'dialogs': { [key]: dialogState },
          'dialogsLight': { [key]: light },
          'dialogsDark': { [key]: dark },
        } as TNetState
      });
    } else {
      log('Failed.');
      reply.code(404).send({
        state: {
          'dialogs': {
            [key]: {
              '_key': key,
              'title': 'Dialog not found',
              'open': false,
            }
          } as TStateAllDialogs
        },
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('not_found')
          .withTitle(`Dialog ${key} Not found`)
          .build(),
      });
    }
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}