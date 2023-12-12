import { RouteShorthandOptions } from 'fastify'
import { default_500_error_response }
  from 'src/business.logic/jsonapi.error.builder'
import Config from '../config'
import { TCipheredUser } from '../schema/users'

const on_request: RouteShorthandOptions['onRequest'] = async (
  req,
  reply,
  // done
) => {
  try {
    const payload = await req.jwtVerify()
    req.usr = payload as TCipheredUser
    // TODO Write more session related logic here
  } catch (err) {
    Config.log('[ERROR] JWT verification failed.', err)
    reply.send(default_500_error_response(err))
  }
}

export default on_request