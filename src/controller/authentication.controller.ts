import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { check_password } from '../business.logic/security';
import { defaultDialogAlertState as alert } from '../state/dialog';
import { ISignInCredentials } from '../business.logic/security/permissions';
import {
  default_401_error_response,
  default_500_error_response
} from '../business.logic/builder/JsonapiErrorBuilder';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import get_bootstrap_authenticated_state from '../state/bootstrap';
import { TJsonapiStateResponse, TNetState } from '../shared';
import { get_ciphered_user, get_user } from 'src/model/session';
import {  get_theme_mode, option } from '../business.logic';
import { ensureDefaultUserExists } from '../business.logic/ensure.default.user';
import { USER_CACHE } from '../business.logic/cache';
import { ler, log, log_err, write as print } from '../utility/logging';

export default async function authentication_controller (fastify: FastifyInstance) {

  fastify.post('/', {}, async function  (
    req: FastifyRequest<ISignInCredentials>,
    reply: FastifyReply,
  ) {
    const credentials = req.body.credentials ?? {};
    const { username, password, options: o } = credentials;
    log(`[DEBUG] req.body:`, req.body);
    print('[DEBUG] Authenticating user... ');
    if (username) {
      try {
        const user = await get_user({ name: username }); // uses cache internally
        if (user) {
          if (password && user.password) {
            const passwordIsCorrect = await check_password(password, user.password);
            if (passwordIsCorrect) {
              USER_CACHE.set(user.name, user);
              const usr = get_ciphered_user(user);
              const expiresIn = option<string>(o)('keep-signed-in', '2M', '1d');
              const token = await reply.jwtSign(usr, { expiresIn });
              log('Successs! User authenticated.');
              log('[DEBUG] Session expires in', expiresIn === '2M'
                ? '2 months.'
                : '24 hours.'
              );
              const theme = get_theme_mode(req.body.cookie);
              reply
                .code(200)
                .send({
                  'state': await get_bootstrap_authenticated_state({
                    usr,
                    token,
                    theme
                  })
                } as TJsonapiStateResponse);
              return;
            }
          }
        }
      } catch (e) {
        log(MSG_500_ERROR_MESSAGE);
        log_err('in attempting to authenticate user', e);
        reply.code(500).send({
          ...alert((e as Error).message),
          ...default_500_error_response(e)
        } as TNetState);
        return;
      }
    }
    const title = 'Wrong username or password!';
    log(`Failed.\n[DEBUG][401] '${title}'`);

    // Optional: Try to create default user if none exist (useful for empty database scenario)
    try {
      const defaultUserCreated = await ensureDefaultUserExists();
      if (defaultUserCreated) {
        const additionalMessage = ' A default admin user has been created (admin/admin123).';
        reply.code(401).send({
          ...alert(title + additionalMessage),
          ...default_401_error_response({ title: title + additionalMessage })
        });
        return;
      }
    } catch (e) {
      ler('[DEBUG] Failed to create default user:', e);
    }

    reply.code(401).send({
      ...alert(title),
      ...default_401_error_response({ title })
    });
  });

}
