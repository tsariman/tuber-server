import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/jsonapi.error.builder';
import DEV_STATE_FORM from '../form';
import { TNetState } from '../../shared';
import { MSG_500_ERROR_MESSAGE } from '../../constants.server';
import { log, write as print } from '../../utility/logging';

export default async function dev_post_state_forms_endpoint(
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key;
    if (!key) {
      log(`[ERROR] 'key' was not received.`);
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('bad_request')
        .withTitle('Missing information')
      );
      return;
    }
    print(`[DEBUG] Loading '${key}' state... `);
    const formState = DEV_STATE_FORM[key];
    if (formState) {
      log('Done.');
      reply.code(200).send({
        'state': {
          'forms': { [key]: formState }
        } as TNetState
      });
    } else {
      log('Failed.');
      reply.code(404).send({
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('not_found')
          .withTitle(`Form ${key} Not found`)
          .build(),
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        } as TNetState
      });
    }
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}