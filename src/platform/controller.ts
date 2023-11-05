import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import twitch_renew_access_token_enpoint from './endpoint/twitch.renew.access.token.ep'

export default async function platform_controller(fastify: FastifyInstance) {

  fastify.get('/', {}, async function (
    _req: FastifyRequest,
    _reply: FastifyReply
  ) {
    
  })

  fastify.get('/twitch/access-token', {}, twitch_renew_access_token_enpoint)
}