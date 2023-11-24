import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  get_twitch_renew_access_token_endpoint
} from './endpoint/get.twitch.renew.access.token.ep'
import get_video_thumbnail_url_endpoint from './endpoint/get.video.thumbnail.url.ep'

export default async function platform_controller(fastify: FastifyInstance) {

  fastify.get('/', {}, async function (
    _req: FastifyRequest,
    _reply: FastifyReply
  ) {
    
  })

  fastify.get('/twitch/access-token', {}, get_twitch_renew_access_token_endpoint)

  // NOT NECESSARY
  // POST /platform/video/thumbnail-url
  fastify.get('/video/thumbnail-url', {}, get_video_thumbnail_url_endpoint)
}