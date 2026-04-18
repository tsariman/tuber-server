import { randomBytes } from 'node:crypto'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder'
import { error_id } from '../business.logic/errors'
import { read_user_by_id, transform_user_doc, UserModel } from '../model/user'
import { USER_CACHE } from '../business.logic/cache'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'
import { IUser } from '../schema/user'
import { sendVerificationEmail } from '../utility/mailer'
import { ler, log_err } from '../utility/logging'

/** `GET /account` endpoint handler */
const get_account_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.usr?._id
    if (!userId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    const user = await read_user_by_id(userId)
    if (!user) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an account for the authenticated user.')
        .build())
      return
    }

    reply.code(200).send(JsonapiResponseBuilder
      .forSingleResource(transform_user_doc(user), 'account')
      .withId(user._id)
      .build())
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50052]'))
    log_err('[50052] GET account', e)
    reply.code(500).send(error_id(50052).default_500_error_response(e))
  }
}

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,21}$/
const NAME_REGEX = /^[a-zA-Z\s\-']{0,21}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const ACCOUNT_PROFILE_EDITING_ENABLED = true
const EMAIL_VERIFICATION_WINDOW_MS = 24 * 60 * 60 * 1000

/** `POST /account` endpoint handler for updating authenticated account details. */
const post_account_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.usr?._id
    const userName = req.usr?.name
    if (!userId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    if (!ACCOUNT_PROFILE_EDITING_ENABLED) {
      reply.code(503).send(new JsonapiErrorBuilder()
        .withStatus(503)
        .withCode('SERVICE_UNAVAILABLE')
        .withTitle('Account editing temporarily unavailable')
        .withDetail('Updating profile details is temporarily disabled.')
        .build())
      return
    }

    const currentUser = await UserModel.findOne({
      _id: userId,
      is_active: { $ne: false }
    }).select('_id name email_verified')

    if (!currentUser) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an active account for the authenticated user.')
        .build())
      return
    }

    if (currentUser.email_verified !== true) {
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withCode('EMAIL_NOT_VERIFIED' as any)
        .withTitle('Email verification required')
        .withDetail('Please verify your email address before editing account details.')
        .build())
      return
    }

    const driver = new JsonapiRequestDriver<IUser>(req.body as Record<string, unknown>)
    const attrs = (driver.getAttributes() ?? {}) as Partial<IUser>

    const nextName = typeof attrs.name === 'string'
      ? attrs.name.trim().toLowerCase()
      : undefined
    const nextFirstName = typeof attrs.firstname === 'string'
      ? attrs.firstname.trim()
      : undefined
    const nextLastName = typeof attrs.lastname === 'string'
      ? attrs.lastname.trim()
      : undefined
    const nextEmail = typeof attrs.email === 'string'
      ? attrs.email.trim().toLowerCase()
      : undefined
    const nextPhone = typeof attrs.phone === 'string'
      ? attrs.phone.trim()
      : undefined

    if (typeof nextName === 'string' && !USERNAME_REGEX.test(nextName)) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('INVALID_FORMAT')
        .withTitle('Invalid username')
        .withDetail('Username must be 3-21 characters and contain only letters, numbers, underscores, and hyphens.')
        .build())
      return
    }

    if (typeof nextFirstName === 'string' && !NAME_REGEX.test(nextFirstName)) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('INVALID_FORMAT')
        .withTitle('Invalid first name')
        .withDetail('First name may only contain letters, spaces, hyphens, and apostrophes.')
        .build())
      return
    }

    if (typeof nextLastName === 'string' && !NAME_REGEX.test(nextLastName)) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('INVALID_FORMAT')
        .withTitle('Invalid last name')
        .withDetail('Last name may only contain letters, spaces, hyphens, and apostrophes.')
        .build())
      return
    }

    if (typeof nextEmail === 'string' && !EMAIL_REGEX.test(nextEmail)) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('INVALID_FORMAT')
        .withTitle('Invalid email')
        .withDetail('Please provide a valid email address.')
        .build())
      return
    }

    if (nextName) {
      const existingByName = await UserModel.findOne({
        _id: { $ne: userId },
        name: nextName,
        is_active: { $ne: false }
      }).select('_id')
      if (existingByName) {
        reply.code(409).send(new JsonapiErrorBuilder()
          .withStatus(409)
          .withCode('DUPLICATE_RESOURCE')
          .withTitle('Username already exists')
          .withDetail('Please choose another username.')
          .build())
        return
      }
    }

    if (nextEmail) {
      const existingByEmail = await UserModel.findOne({
        _id: { $ne: userId },
        email: nextEmail,
        is_active: { $ne: false }
      }).select('_id')
      if (existingByEmail) {
        reply.code(409).send(new JsonapiErrorBuilder()
          .withStatus(409)
          .withCode('DUPLICATE_RESOURCE')
          .withTitle('Email already in use')
          .withDetail('Please use a different email address.')
          .build())
        return
      }
    }

    const updates: Partial<IUser> & { modified_at: Date } = {
      modified_at: new Date()
    }
    if (typeof nextName === 'string') { updates.name = nextName }
    if (typeof nextFirstName === 'string') { updates.firstname = nextFirstName }
    if (typeof nextLastName === 'string') { updates.lastname = nextLastName }
    if (typeof nextEmail === 'string') { updates.email = nextEmail }
    if (typeof nextPhone === 'string') { updates.phone = nextPhone }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, is_active: { $ne: false } },
      updates,
      { new: true }
    )

    if (!updatedUser) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an active account for the authenticated user.')
        .build())
      return
    }

    if (userName && userName !== updatedUser.name) {
      USER_CACHE.del(userName)
    }
    USER_CACHE.del(updatedUser.name)

    reply.code(200).send(JsonapiResponseBuilder
      .forSingleResource(transform_user_doc(updatedUser), 'account')
      .withId(updatedUser._id)
      .build())
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50054]'))
    log_err('[50054] POST account', e)
    reply.code(500).send(error_id(50054).default_500_error_response(e))
  }
}

/** `POST /account/resend-verification` endpoint handler. */
const post_account_resend_verification_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.usr?._id
    if (!userId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    const user = await UserModel.findOne({
      _id: userId,
      is_active: { $ne: false }
    })

    if (!user) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an active account for the authenticated user.')
        .build())
      return
    }

    if (user.email_verified === true) {
      reply.code(200).send(JsonapiResponseBuilder
        .forSingleResource(transform_user_doc(user), 'account')
        .withId(user._id)
        .withState({
          app: { route: 'default-success' },
          tmp: {
            'default-success': {
              'message': 'Your email is already verified.'
            }
          }
        })
        .build())
      return
    }

    if (!user.email) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('INVALID_FORMAT')
        .withTitle('Missing email')
        .withDetail('A valid email address is required before a verification email can be sent.')
        .build())
      return
    }

    const code = randomBytes(24).toString('hex')
    user.email_verification_code = code
    user.email_verification_code_expires = new Date(Date.now() + EMAIL_VERIFICATION_WINDOW_MS)
    await user.save()
    USER_CACHE.del(user.name)

    sendVerificationEmail(user.email, code).catch(err => {
      log_err('Email send (verification resend) failed', err)
    })

    reply.code(200).send(JsonapiResponseBuilder
      .forSingleResource(transform_user_doc(user), 'account')
      .withId(user._id)
      .withState({
        app: { route: 'default-success' },
        tmp: {
          'default-success': {
            'message': 'Verification email sent. Please check your inbox.'
          }
        }
      })
      .build())
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50055]'))
    log_err('[50055] POST account/resend-verification', e)
    reply.code(500).send(error_id(50055).default_500_error_response(e))
  }
}

/** `DELETE /account` endpoint handler (soft delete for authenticated account). */
const delete_account_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.usr?._id
    const userName = req.usr?.name
    if (!userId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, is_active: { $ne: false } },
      {
        is_active: false,
        jwt_version: (req.usr?.jwt_version ?? 0) + 1,
        modified_at: new Date()
      },
      { new: true }
    )

    if (!updatedUser) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an active account for the authenticated user.')
        .build())
      return
    }

    if (userName) {
      USER_CACHE.del(userName)
    }
    reply.clearCookie('token', { path: '/' })
    reply.code(204).send()
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50053]'))
    log_err('[50053] DELETE account', e)
    reply.code(500).send(error_id(50053).default_500_error_response(e))
  }
}

const account: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const opts = {
    ...rootOpts,
    ...DEFAULT_ROUTE_OPTIONS,
  }

  fastify.get('/account', opts, get_account_endpoint)
  fastify.post('/account', opts, post_account_endpoint)
  fastify.post('/account/resend-verification', opts, post_account_resend_verification_endpoint)
  fastify.delete('/account', opts, delete_account_endpoint)
}

export default account