import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/JsonapiErrorBuilder';
import  { STATE_DIALOGS, STATE_DIALOGS_THEME_DARK } from '../dialog';
import {
  MSG_500_ERROR_MESSAGE,
  TNetState,
  TStateAllDialogs
} from '@tuber/shared';
import { TThemeMode } from '../../common.types';
import { themed } from '../../business.logic';
import { ler, log, log_err, write } from '../../utility/logging';

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
        .withCode('MISSING_VALUE')
        .withTitle('Missing information')
      );
      return;
    }
    if (!mode) {
      log(`[ERROR] 'mode' was not received.`);
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
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
          .withCode('RESOURCE_NOT_FOUND')
          .withTitle(`Dialog ${key} Not found`)
          .build(),
      });
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('POST state dialog', e);
    reply.code(500).send(default_500_error_response(e));
  }
}