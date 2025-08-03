import { RouteShorthandOptions } from 'fastify';
import {
  default_401_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import Config from '../config';
import { log } from '../utility/logging';
import { TCipheredUser } from '../schema/users';

/**
 * Supply authentication check for all routes.
 *
 * @param req 
 * @param reply 
 * @param done 
 */
const default_on_request: RouteShorthandOptions['onRequest'] = async (
  req,
  reply,
  // done
) => {
  try {
    const payload = await req.jwtVerify();
    req.usr = payload as TCipheredUser;

    // TODO Write more session related logic here

  } catch (e) {
    log('[ERROR] JWT verification failed.', e);
    reply.code(401).send(default_401_error_response({
      code: 'unauthorized',
      status: '401',
      title: 'JWT verification failed.',
      detail: (e as Error).stack,
      source: {
        pointer: '/src/middleware/on.request.ts',
        parameter: req.url
      }
    }));
  }
};

export default default_on_request;

/**
 * [TODO] Test this logic to make sure it does not cause a 401 http error code.
 * @param req
 * @param reply
 * @param done
 */
export const dev_on_request: RouteShorthandOptions['onRequest'] = async (
  req,
  reply,
  done
) => {
  try {
    if (Config.DEBUG) { // Allow access if app is in development mode.
      done();
    } else {
      // Allow access to the route if user is authenticated just like in
      // the default behavior.
      const payload = await req.jwtVerify();
      req.usr = payload as TCipheredUser;
  
      // TODO Write more session related logic here
    }
  } catch (e) {
    if (Config.DEBUG) {
      log('[ERROR] JWT verification failed.', e);
      reply.code(401).send(default_401_error_response({
        code: 'unauthorized',
        status: '401',
        title: 'JWT verification failed.',
        detail: (e as Error).stack,
        source: {
          pointer: '/src/middleware/on.request.ts',
          parameter: req.url
        }
      }));
    }
  }

}