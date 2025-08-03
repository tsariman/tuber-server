import { RouteShorthandOptions } from 'fastify';
import { MISSING_ACCESS_TOKEN, DEFAULT_AUTH_HEADER } from '../constants.server';
import {
  $400_MISSING_PAYLOAD,
  $401_MISSING_ACCESS_TOKEN,
  $401_UNAUTHORIZED_ACCESS,
  $403_ACCESS_TOKEN_FORBIDDEN
} from '../business.logic/errors';
import { USER_CACHE } from '../business.logic/cache';
import { TCipheredUser } from '../schema/users';
import { UserPaginationModel } from '../model/user';
import { log } from '../utility/logging';

const pre_handler_authenticate: RouteShorthandOptions['preHandler'] = async function(
  request,
  reply,
  next
) {
  const authHeader = request.headers['authorization'] || DEFAULT_AUTH_HEADER;
  const token = authHeader.split(' ')[1];

  if (token === MISSING_ACCESS_TOKEN) {
    return reply.code(401).send($401_MISSING_ACCESS_TOKEN);
  }

  request.jwtVerify(async (err, cUsr) => {
    if (err) {
      log(err);
      reply.code(403).send($403_ACCESS_TOKEN_FORBIDDEN);
    }

    // This should never happen but just in case
    if (!cUsr) {
      log('[DEBUG] Authentication: User not found');
      reply.code(400).send($400_MISSING_PAYLOAD);
    }

    const cUsr1 = cUsr as TCipheredUser;
    const cachedUsr = USER_CACHE.get(cUsr1.name) as TCipheredUser;

    // User not found in cache
    if (!cachedUsr) {
      log('[DEBUG] Authentication: User not found in cache. Retrieving '
        + 'from database.'
      );
      const dbUser = await UserPaginationModel.findOne({ name: cUsr1.name });
      if (!dbUser) {
        log('[DEBUG] Authentication: User not found in database.');
        reply.code(401).send($401_UNAUTHORIZED_ACCESS);
      } else {
        const newUsr: TCipheredUser = {
          _id: dbUser._id,
          name: dbUser.name,
          role: dbUser.role,
          jwt_version: dbUser.jwt_version
        };
        request.usr = newUsr;
        USER_CACHE.set(newUsr.name, newUsr);
      }

    // User found in cache
    } else {
      request.usr = cachedUsr;
    }
    next();
  });
}

export default pre_handler_authenticate;