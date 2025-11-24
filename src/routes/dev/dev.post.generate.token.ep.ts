import { FastifyRequest, FastifyReply } from 'fastify'
import { get_ciphered_user, read_user } from '../../model/session'
import { log_safe, task, task_end } from '../../utility/logging'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'

interface IGenerateTokenRequest {
  Body: {
    username?: string
    expiresIn?: string
  }
}

/**
 * Development endpoint to quickly generate JWT tokens for testing
 * POST /dev/generate-token
 */
export default async function dev_post_generate_token_endpoint(
  req: FastifyRequest<IGenerateTokenRequest>,
  reply: FastifyReply
) {
  const { username = 'riviere', expiresIn = '1d' } = req.body || {}

  log_safe('[DEV] Generating token for user:', username)
  task('Generating development token... ')

  try {
    const user = await read_user({ name: username })
    
    if (!user) {
      task_end('Failed. User not found.')
      reply.code(404).send(
        new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('RESOURCE_NOT_FOUND')
          .withTitle('User not found')
          .withDetail(`No user found with username: ${username}`)
          .build()
      )
      return
    }

    const usr = get_ciphered_user(user)
    const token = await reply.jwtSign(usr, { expiresIn })
    
    task_end('Success!')
    
    reply.code(200).send({
      token,
      user: {
        _id: usr._id,
        name: usr.name,
        role: usr.role
      },
      expiresIn
    })
  } catch (e) {
    task_end('Failed with error.')
    reply.code(500).send(
      new JsonapiErrorBuilder()
        .withStatus(500)
        .withCode('AUTH_ERROR')
        .withTitle('Failed to generate token')
        .withDetail((e as Error).message)
        .build()
    )
  }
}
