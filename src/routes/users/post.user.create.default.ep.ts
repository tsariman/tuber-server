import { FastifyReply, FastifyRequest } from 'fastify';
import Config from '../../config';
import { ler, log, log_err } from '../../utility/logging';
import { defaultDialogAlertState as alert } from '../../state/dialog';
import { default_500_error_response } from '../../business.logic/errors';
import {
  MSG_500_ERROR_MESSAGE,
  TJsonapiErrorResponse,
  TJsonapiResponse,
  TNetState
} from '@tuber/shared';
import { read_user_collection_count } from '../../model/user';
import {
  createDefaultUser,
  DEFAULT_USER_TEMPLATES
} from '../../business.logic/ensure.default.user';

interface ICreateDefaultUserRequest {
  Body: {
    template?: keyof typeof DEFAULT_USER_TEMPLATES;
    force?: boolean;
  }
}

/**
 * Endpoint to manually create a default user.
 * This can be useful for:
 * - Initial setup
 * - Recovery scenarios
 * - Development/testing
 */
export default async function post_create_default_user_endpoint(
  req: FastifyRequest<ICreateDefaultUserRequest>,
  reply: FastifyReply
) {
  try {
    // Only allow default user creation in debug mode
    if (!Config.DEBUG) {
      reply.code(403).send({
        ...alert('Default user creation is only allowed in debug mode'),
        error: {
          code: 'DEBUG_MODE_REQUIRED',
          status: 403,
          title: 'Debug Mode Required',
          detail: 'Default user creation is only allowed when the application is in debug mode'
        }
      } as TNetState);
      return;
    }

    const { template = 'admin', force = false } = req.body || {};
    
    // Check if users already exist (unless force is true)
    if (!force) {
      const userCount = await read_user_collection_count();
      if (userCount > 0) {
        reply.code(409).send({
          ...alert(`Users already exist in the database (${userCount} found). Use force=true to create anyway.`),
          error: {
            code: 'USERS_EXIST',
            status: 409,
            title: 'Users Already Exist',
            detail: `Found ${userCount} users in database. Cannot create default user unless forced.`
          }
        } as TNetState);
        return;
      }
    }
    
    // Create the default user
    const user = await createDefaultUser(template);
    
    const successMessage = `Default ${template} user created successfully! ` +
      `Username: ${DEFAULT_USER_TEMPLATES[template].name}, ` +
      `Password: ${DEFAULT_USER_TEMPLATES[template].password}`;
    
    log(`[SUCCESS] ${successMessage}`);

    reply.code(201).send({
      ...alert(successMessage),
      data: {
        type: 'user',
        id: user._id,
        attributes: {
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }
      }
    } as TJsonapiResponse);

  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('POST default user', e);
    reply.code(500).send({
      ...alert('Failed to create default user: ' + (e as Error).message),
      ...default_500_error_response(e)
    } as TJsonapiErrorResponse);
  }
}
