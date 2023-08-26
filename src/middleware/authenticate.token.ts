import { RouteShorthandOptions } from 'fastify'
import { MISSING_ACCESS_TOKEN, DEFAULT_AUTH_HEADER } from 'src/constants'
import { $401_MISSING_ACCESS_TOKEN, $403_ACCESS_TOKEN_FORBIDDEN } from '../business.logic/errors'
import jwt from 'jsonwebtoken'
import Config from 'src/config'
import { TCipheredUser } from 'src/schema/users'

const tokenAuthenticate: RouteShorthandOptions['preValidation'] = async function(
  request,
  reply,
  next
) {
  const authHeader = request.headers['authorization'] || DEFAULT_AUTH_HEADER
  const token = authHeader.split(' ')[1]

  if (token === MISSING_ACCESS_TOKEN) {
    return reply.code(401).send($401_MISSING_ACCESS_TOKEN)
  }

  jwt.verify(token, Config.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      Config.log(err)
      reply.code(403).send($403_ACCESS_TOKEN_FORBIDDEN)
    }
    request.usr = user as TCipheredUser
    next()
  })
}

export default tokenAuthenticate