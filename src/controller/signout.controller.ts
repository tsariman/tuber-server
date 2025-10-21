import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import {
  default_500_error_response
} from '../business.logic/builder/JsonapiErrorBuilder';
import { USER_CACHE } from '../business.logic/cache';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';
import { TCipheredUser } from '../schema/users';
import { log, log_err } from '../utility/logging';

export default async function signout_controller (fastify: FastifyInstance) {

  fastify.post('/', async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { name } = req.user as TCipheredUser;
      USER_CACHE.del(name);
    } catch (e) {
      log(MSG_500_ERROR_MESSAGE);
      log_err('attempting signout user', e);
      reply.code(500).send(default_500_error_response(e));
    }
  });

}