import { FastifyReply } from 'fastify'
import { MONGODB_DUPLICATE_KEY_ERROR, error_id, get_mongodb_error } from '../../business.logic/errors'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { create_user, transform_user_doc } from '../../model/user'
import { TUsersFastifyRequest } from '../../schema/user'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import RequestDataValidator from '../../business.logic/RequestDataValidator'
import newUserFormState from '../../state/form/new.user.form.state'
import crypto from 'crypto'
import { sendVerificationEmail } from '../../utility/mailer'
import Config from '../../config'
import { to_error_object } from '../../utility'
const IS_TEST = process.env.TEST === 'true'
// duplicate import removed
// Lightweight development rate limiter (per-IP)
const signupAttempts: Map<string, { count: number; resetAt: number }> = new Map()
const SIGNUP_WINDOW_MS = 60 * 1000
const SIGNUP_MAX_ATTEMPTS = 5

const signupSnackbarState = (
  message: string,
  variant: 'success' | 'error' | 'warning' | 'info' = 'info'
) => ({
  'snackbar': {
    'open': true,
    'type': 'message' as const,
    'variant': variant,
    'message': message
  }
})

/** `POST /users` endpoint handler */
export default async function post_user_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    // Basic rate limit: 5 attempts per minute per IP (dev only)
    // Bypass during tests when TEST env is set
    if (Config.DEV && !IS_TEST) {
      const ip = (req.ip || req.headers['x-forwarded-for'] as string || 'unknown').toString()
      const now = Date.now()
      const entry = signupAttempts.get(ip)
      if (!entry || now > entry.resetAt) {
        signupAttempts.set(ip, { count: 1, resetAt: now + SIGNUP_WINDOW_MS })
      } else {
        entry.count += 1
        if (entry.count > SIGNUP_MAX_ATTEMPTS) {
          reply.code(429).send(new JsonapiErrorBuilder()
            .withStatus(429)
            .withCode('RATE_LIMITED')
            .withTitle('Too Many Requests')
            .withDetail('Please wait a minute before trying again.')
            .withState(signupSnackbarState('Too many sign-up attempts. Please wait a minute and try again.', 'warning'))
            .build())
          return
        }
      }
    }
    const newUserResource = new JsonapiRequestDriver(req.body).getAttributes()
    if (newUserResource) {
      const validator = new RequestDataValidator(newUserResource, newUserFormState)
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        reply.code(400).send({
          ...errorResponse,
          'state': signupSnackbarState('Please review the form and try again.', 'error')
        })
        return
      }

      // Additional server-side password strength validation
      if (!Config.DEV) {
        const password = validator.getAttribute('password')
        if (!password || password.length < 12
          || !/[A-Z]/.test(password)
          || !/[a-z]/.test(password)
          || !/[0-9]/.test(password)
          || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
          reply.code(400).send(new JsonapiErrorBuilder()
            .withStatus(400)
            .withCode('VALIDATION_ERROR')
            .withTitle('Password is too weak')
            .withDetail('Password must be at least 12 characters and include uppercase, lowercase, numbers, and symbols.')
            .withState(signupSnackbarState('Password must be at least 12 characters and include uppercase, lowercase, numbers, and symbols.', 'error'))
            .build())
          return
        }
      }

      // Generate email verification code valid for 24 hours
      const code = crypto.randomBytes(24).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const user = await create_user({
        ...newUserResource,
        email_verified: false,
        email_verification_code: code,
        email_verification_code_expires: expires,
      })

      // Fire-and-forget email send (do not block response)
      if (user.email) {
        sendVerificationEmail(user.email, code).catch(err => {
          log_err('Email send (verification) failed', err)
        })
      }
      reply.code(201).send(
        JsonapiResponseBuilder.forSingleResource(transform_user_doc(user), 'users')
          .withState({
            'app': {
              'route': 'default-success',
            },
            ...signupSnackbarState(`Welcome, ${user.name}! Your account was created successfully.`, 'success'),
            'tmp': {
              'default-success': {
                'message': `User <strong>${user.name}</strong> successfully created!`
              }
            }
          })
          .build()
      )
    }
  } catch (e) {
    const error = to_error_object(e)
    const mongoDbError = get_mongodb_error(error.message)
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      const duplicateMessage = /name/i.test(mongoDbError.detail)
        ? 'That username is already taken. Please choose another one.'
        : /email/i.test(mongoDbError.detail)
          ? 'That email is already registered. Try signing in or use another address.'
          : 'That account already exists. Please use different details and try again.'

      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
        .withStatus(409)
        .withTitle('Account already exists')
        .withDetail(duplicateMessage)
        .withState(signupSnackbarState(duplicateMessage, 'error'))
        .build())
    } else {
      ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50047]'))
      log_err('[50047] POST user', error)
      reply.code(500).send(error_id(50047).default_500_error_response(error))
    }
  }
}
