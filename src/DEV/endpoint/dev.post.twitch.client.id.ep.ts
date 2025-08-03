import { FastifyRequest, FastifyReply } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/builder/jsonapi.error.builder';
import Config from '../../config';
import {
  $60_STATE_KEY,
  CONF_TWITCH_CLIENT_ID,
  CONF_TWITCH_CLIENT_SECRET,
  MSG_500_ERROR_MESSAGE
} from '../../constants.server';
import { log, write as print } from '../../utility/logging';
import { TNetState } from '../../shared';

interface IPostRequest {
  Body: {
    client_id?: string;
    client_secret?: string;
  };
}

/**
 * Save the Twitch Client ID and Secret to the database.
 *
 * @param req 
 * @param reply 
 * @returns `Promise<void>`
 */
export default async function dev_post_twitch_client_id_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  try {
    const clientId = req.body.client_id;
    const clientSecret = req.body.client_secret;
    if (!clientId || !clientSecret) {
      log('[ERROR]: Client ID and Secret are required.');
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('bad_request')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      );
      return;
    }
    print(`[DEBUG] Saving Twitch Client ID and Secret... `);
    await Config.save(CONF_TWITCH_CLIENT_ID, clientId);
    await Config.save(CONF_TWITCH_CLIENT_SECRET, clientSecret);
    log('Success!');
    reply.code(200).send({
      'state': {
        'formsData': {
          [$60_STATE_KEY]: { client_id: '', client_secret: '' }
        }
      } as TNetState
    });
  } catch (e) {
    log(`${MSG_500_ERROR_MESSAGE} while saving Twitch Client ID`
      + ` and Secret.`, e);
    reply.code(500).send(default_500_error_response);
  }
}