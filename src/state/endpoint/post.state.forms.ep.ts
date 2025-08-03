import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/jsonapi.error.builder';
import { ler, log, log_err, write } from '../../utility/logging';
import { STATE_FORMS, STATE_FORMS_THEME_DARK } from '../form';
import { TNetState } from '../../shared';
import { TThemeMode } from '../../common.types';
import { MSG_500_ERROR_MESSAGE } from '../../constants.server';
import { themed } from '../../business.logic';

export default async function post_state_forms_endpoint (
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
    const light = STATE_FORMS[key];
    const dark = STATE_FORMS_THEME_DARK[key];
    const formState = themed(light, dark, mode);
    if (formState) {
      log('Done.');
      reply.code(200).send({
        state: {
          'forms': { [key]: formState },
          'formsLight': { [key]: STATE_FORMS[key] },
          'formsDark': { [key]: STATE_FORMS_THEME_DARK[key] },
        } as TNetState
      });
    } else {
      log('Failed.');
      reply.code(404).send({
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        },
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('not_found')
          .withTitle(`Form ${key} Not found`)
          .build(),
      });
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE, e);
    log_err('POST state form', e);
    reply.code(500).send(default_500_error_response(e));
  }
}