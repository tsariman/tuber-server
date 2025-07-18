import { FastifyRequest, FastifyReply } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/builder/jsonapi.error.builder';
import Config from '../../config';
import {
  $62_STATE_KEY,
  MSG_500_ERROR_MESSAGE
} from '../../constants';
import { TJsonapiRequest } from 'src/common.types';
import JsonapiRequestDriver from 'src/business.logic/jsonapi.request.driver';

interface IPostRequest {
  Body: TJsonapiRequest<{
    key?: string;
    value?: string;
  }>;
}

/**
 * Save a configuration value to the database.
 *
 * @param req 
 * @param reply 
 * @returns `Promise<void>`
 */
export default async function dev_post_save_config_value_endpoint(
  req: FastifyRequest<IPostRequest>,
  reply: FastifyReply
): Promise<void> {
  try {
    const driver = new JsonapiRequestDriver(req.body);
    const key = driver.getAttribute('key');
    const value = driver.getAttribute('value');

    if (!key || !value) {
      Config.log('[ERROR]: Key and value are required.');
      reply.code(400).send(new JsonapiErrorBuilder()
        .withCode('bad_request')
        .withStatus(400)
        .withTitle('Query parameter is required')
        .build()
      );
      return;
    }
    Config.print(`[DEBUG] Saving configuration value... `);
    await Config.save(key, value);
    Config.log('Success!');
    reply.code(200).send({
      'state': {
        'formsData': {
          [$62_STATE_KEY]: { key: '', value: '' }
        }
      }
    });
  } catch (e) {
    Config.log(`${MSG_500_ERROR_MESSAGE} while saving configuration value.`, e);
    reply.code(500).send(default_500_error_response);
  }
}