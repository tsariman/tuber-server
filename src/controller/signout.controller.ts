import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Config from '../config';
import {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import { MSG_500_ERROR_MESSAGE } from 'src/constants';
import { TCipheredUser } from '../schema/users';

export default async function signout_controller (fastify: FastifyInstance) {

  fastify.post('/', async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { name } = req.user as TCipheredUser;
      Config.USER_CACHE.del(name);
    } catch (e) {
      Config.log(MSG_500_ERROR_MESSAGE);
      reply.code(500).send(default_500_error_response(e));
    }
  });

}