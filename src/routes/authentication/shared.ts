import { FastifyRequest } from 'fastify'

const signinAttempts: Map<string, { count: number; resetAt: number }> = new Map()
const SIGNIN_WINDOW_MS = 60 * 1000
const SIGNIN_MAX_ATTEMPTS = 20
const PASSWORD_RECOVERY_TOKEN_TTL_MS = 60 * 60 * 1000
const PASSWORD_RECOVERY_CODE_REGEX = /^\d{6}$/

const is_https_request = (req: FastifyRequest): boolean => {
  const forwardedProtoHeader = req.headers['x-forwarded-proto']
  const forwardedProto = Array.isArray(forwardedProtoHeader)
    ? forwardedProtoHeader[0]
    : forwardedProtoHeader?.split(',')[0]?.trim()

  return req.protocol === 'https' || forwardedProto === 'https'
}

const get_auth_cookie_options = (req: FastifyRequest, maxAge: number) => ({
  httpOnly: true,
  secure: is_https_request(req),
  sameSite: 'lax' as const,
  maxAge,
  path: '/',
})

export {
  PASSWORD_RECOVERY_CODE_REGEX,
  PASSWORD_RECOVERY_TOKEN_TTL_MS,
  SIGNIN_MAX_ATTEMPTS,
  SIGNIN_WINDOW_MS,
  get_auth_cookie_options,
  is_https_request,
  signinAttempts,
}