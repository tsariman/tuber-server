import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'crypto'
import { check_password } from '../business.logic/security'
import { read_user, get_contextual_user } from '../model/session'
import { USER_CACHE } from '../business.logic/cache'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../business.logic/errors'
import { ler, log_err } from '../utility/logging'
import {
  CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL,
  CONF_TWITCH_DISABLE_TOKEN_RENEWAL,
  MSG_500_ERROR_MESSAGE,
} from '@tuber/shared'
import CLEARANCE_LEVEL from '../business.logic/security/clearance.level'
import OnRequestAuthorization from '../business.logic/OnRequestAuthorization'
import Config from '../config'
import {
  renew_twitch_access_token,
} from '../platform/endpoint/get.twitch.renew.access.token.ep'

interface IAdminSignin {
  Body: {
    data: {
      type: string
      attributes: {
        credentials?: {
          username?: string
          password?: string
        }
      }
    }
  }
}

const ADMIN_CLEARANCE = CLEARANCE_LEVEL.administrator
const ADMIN_TWITCH_RENEWAL_SECRET_HEADER = 'x-admin-maintenance-secret'

const to_header_value = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return (value[0] ?? '').trim()
  }
  return (value ?? '').trim()
}

const has_valid_manual_secret = (req: FastifyRequest): boolean => {
  const expectedSecret = (process.env.ADMIN_TWITCH_RENEWAL_SECRET ?? '').trim()
  if (!expectedSecret) {
    return true
  }
  const receivedSecret = to_header_value(req.headers[ADMIN_TWITCH_RENEWAL_SECRET_HEADER])
  if (!receivedSecret) {
    return false
  }
  const expected = Buffer.from(expectedSecret)
  const received = Buffer.from(receivedSecret)
  if (expected.length !== received.length) {
    return false
  }
  return crypto.timingSafeEqual(expected, received)
}

const admin: FastifyPluginAsync = async (fastify): Promise<void> => {
  /**
   * POST /admin/signin
   *
   * Dedicated sign-in for the standalone admin panel.
   * Returns the JWT token in the response body so the panel can use
   * Bearer-based auth (no cookie required — panel may be a local HTML file).
   * Requires administrator clearance or higher.
   */
  fastify.post('/admin/signin', {}, async (
    req: FastifyRequest<IAdminSignin>,
    reply: FastifyReply
  ) => {
    try {
      const credentials = req.body?.data?.attributes?.credentials
      const username = credentials?.username?.trim()
      const password = credentials?.password

      if (!username || !password) {
        reply.code(400).send(new JsonapiErrorBuilder()
          .withStatus(400)
          .withCode('MALFORMED_REQUEST')
          .withTitle('Credentials Required')
          .withDetail('Both username and password are required.')
          .build())
        return
      }

      const user = await read_user({ name: username, includePassword: true })
      const INVALID = 'Wrong username or password!'

      if (!user || !user.password) {
        reply.code(401).send(new JsonapiErrorBuilder()
          .withStatus(401)
          .withCode('AUTHENTICATION_REQUIRED')
          .withTitle(INVALID)
          .build())
        return
      }

      const passwordIsCorrect = await check_password(password, user.password)
      if (!passwordIsCorrect) {
        reply.code(401).send(new JsonapiErrorBuilder()
          .withStatus(401)
          .withCode('AUTHENTICATION_REQUIRED')
          .withTitle(INVALID)
          .build())
        return
      }

      const roleClearance = CLEARANCE_LEVEL[user.role ?? 'free']
      if (roleClearance < ADMIN_CLEARANCE) {
        reply.code(403).send(new JsonapiErrorBuilder()
          .withStatus(403)
          .withCode('INSUFFICIENT_PERMISSION')
          .withTitle('Forbidden')
          .withDetail(`Your role (${user.role}) does not have admin panel access. Administrator or higher is required.`)
          .build())
        return
      }

      USER_CACHE.set(user.name, user)
      const usr = get_contextual_user(user)
      const token = await reply.jwtSign(usr, { expiresIn: '24h' })

      reply.code(200).send({
        data: {
          type: 'admin-sessions',
          attributes: {
            token,
            user: {
              name: user.name,
              role: user.role,
              email: user.email,
            }
          }
        }
      })
    } catch (e) {
      ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50052]'))
      log_err('[50052] POST /admin/signin', e)
      reply.code(500).send(error_id(50052).default_500_error_response(e))
    }
  })

  fastify.post('/admin/twitch/renew-access-token', {
    preHandler: async (req, reply): Promise<void> => {
      try {
        await (new OnRequestAuthorization(req)).authorizeRequest()
      } catch {
        reply.code(401).send(new JsonapiErrorBuilder()
          .withStatus(401)
          .withCode('AUTHENTICATION_REQUIRED')
          .withTitle('JWT verification failed.')
          .build())
      }
    }
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!req.usr) {
        reply.code(401).send(new JsonapiErrorBuilder()
          .withStatus(401)
          .withCode('AUTHENTICATION_REQUIRED')
          .withTitle('Authorization failed.')
          .build())
        return
      }

      const role = req.usr.role ?? 'free'
      const roleClearance = CLEARANCE_LEVEL[role]
      if (roleClearance < ADMIN_CLEARANCE) {
        reply.code(403).send(new JsonapiErrorBuilder()
          .withStatus(403)
          .withCode('INSUFFICIENT_PERMISSION')
          .withTitle('Forbidden')
          .withDetail('Administrator or higher role is required for this endpoint.')
          .build())
        return
      }

      if (!has_valid_manual_secret(req)) {
        reply.code(403).send(new JsonapiErrorBuilder()
          .withStatus(403)
          .withCode('INSUFFICIENT_PERMISSION')
          .withTitle('Forbidden')
          .withDetail(`Missing or invalid ${ADMIN_TWITCH_RENEWAL_SECRET_HEADER} header.`)
          .build())
        return
      }

      // Ensure manual recovery can proceed even when auto-renew was disabled.
      await Config.save(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, false)
      await Config.save(CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, false)

      const result = await renew_twitch_access_token()
      if (!result.ok) {
        reply.code(502).send(new JsonapiErrorBuilder()
          .withStatus(502)
          .withCode('INTERNAL_ERROR')
          .withTitle('Twitch token renewal failed')
          .withDetail(result.reason)
          .withMeta('attempts', result.attempts)
          .build())
        return
      }

      reply.code(200).send({
        data: {
          type: 'twitch-token-renewal',
          attributes: {
            ok: true,
            attempts: result.attempts,
            reason: result.reason,
          }
        }
      })
    } catch (e) {
      log_err('[50053] POST /admin/twitch/renew-access-token', e)
      reply.code(500).send(error_id(50053).default_500_error_response(e))
    }
  })
}

export default admin
