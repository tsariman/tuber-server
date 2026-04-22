import { FastifyPluginAsync, FastifyReply } from 'fastify'
import crypto from 'node:crypto'
import { DEFAULT_ROUTE_OPTIONS, PUBLIC_ROUTE_OPTIONS } from '../middleware/router.option'
import { UserModel } from '../model/user'
import { USER_CACHE } from '../business.logic/cache'
import { is_record } from '../utility'
import { dbug, ler } from '../utility/logging'
import Config from '../config'

interface IOAuthStatePayload {
  uid: string
  iat: number
  nonce: string
  returnOrigin?: string
}

interface IStartQuery {
  returnOrigin?: string
}

interface ICallbackQuery {
  code?: string
  state?: string
  error?: string
  error_description?: string
}

const PATREON_AUTH_URL = 'https://www.patreon.com/oauth2/authorize'
const PATREON_TOKEN_URL = 'https://www.patreon.com/api/oauth2/token'
const PATREON_IDENTITY_URL = 'https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields[user]=email,full_name&fields[member]=patron_status,currently_entitled_amount_cents'
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000
const MIN_STATE_SECRET_LENGTH = 32

const is_patreon_oauth_configured = (): boolean => {
  return Boolean(
    Config.PATREON_CLIENT_ID
    && Config.PATREON_CLIENT_SECRET
    && Config.PATREON_OAUTH_STATE_SECRET
    && Config.PATREON_OAUTH_STATE_SECRET.length >= MIN_STATE_SECRET_LENGTH
  )
}

const get_state_secret = (): string => {
  return Config.PATREON_OAUTH_STATE_SECRET
}

const sign_state_payload = (payloadB64: string): string => {
  return crypto
    .createHmac('sha256', get_state_secret())
    .update(payloadB64)
    .digest('base64url')
}

const encode_state = (payload: IOAuthStatePayload): string => {
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const sig = sign_state_payload(payloadB64)
  return `${payloadB64}.${sig}`
}

const decode_and_validate_state = (state: string): IOAuthStatePayload | null => {
  const [payloadB64, sig] = state.split('.')
  if (!payloadB64 || !sig) {
    return null
  }

  const expectedSig = sign_state_payload(payloadB64)
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length) {
    return null
  }
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as IOAuthStatePayload
    if (!parsed || typeof parsed.uid !== 'string' || typeof parsed.iat !== 'number') {
      return null
    }
    if (Date.now() - parsed.iat > OAUTH_STATE_TTL_MS) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const normalize_origin = (origin?: string): string | undefined => {
  if (!origin || typeof origin !== 'string') {
    return undefined
  }
  try {
    const u = new URL(origin)
    return `${u.protocol}//${u.host}`
  } catch {
    return undefined
  }
}

const get_redirect_uri = (): string => {
  const base = (Config.APP_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
  return `${base}/patreon/oauth/callback`
}

const to_callback_redirect_url = (origin: string | undefined, status: string): string => {
  const fallback = normalize_origin(Config.CLIENT_DOMAIN) || 'http://localhost:5173'
  const safeOrigin = normalize_origin(origin) || fallback
  const redirectUrl = new URL(safeOrigin)
  redirectUrl.searchParams.set('patreon_oauth', status)
  redirectUrl.searchParams.set('return_route', '/account')
  return redirectUrl.toString()
}

const exchange_code_for_token = async (code: string): Promise<string | null> => {
  const clientId = Config.PATREON_CLIENT_ID
  const clientSecret = Config.PATREON_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return null
  }

  const form = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: get_redirect_uri(),
  })

  const tokenRes = await fetch(PATREON_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  const tokenJson = await tokenRes.json() as Record<string, unknown>
  if (!tokenRes.ok) {
    dbug('[patreon_oauth] token exchange failed', tokenJson)
    return null
  }

  const accessToken = tokenJson.access_token
  return typeof accessToken === 'string' && accessToken.trim() !== ''
    ? accessToken
    : null
}

const fetch_identity = async (accessToken: string): Promise<{
  patreonUserId?: string
  membershipId?: string
  subscriptionStatus?: 'active' | 'inactive'
} | null> => {
  const identityRes = await fetch(PATREON_IDENTITY_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  })

  const identityJson = await identityRes.json() as Record<string, unknown>
  if (!identityRes.ok || !is_record(identityJson)) {
    dbug('[patreon_oauth] identity fetch failed', identityJson)
    return null
  }

  const data = is_record(identityJson.data) ? identityJson.data : {}
  const included = Array.isArray(identityJson.included) ? identityJson.included : []
  const patreonUserId = typeof data.id === 'string' ? data.id : undefined

  const membership = included.find(item => is_record(item) && item.type === 'member') as Record<string, unknown> | undefined
  const membershipId = membership && typeof membership.id === 'string' ? membership.id : undefined
  const memberAttrs = membership && is_record(membership.attributes)
    ? membership.attributes
    : {}

  const patronStatus = typeof memberAttrs.patron_status === 'string'
    ? memberAttrs.patron_status
    : ''
  const subscriptionStatus: 'active' | 'inactive' = (
    patronStatus === 'active_patron' || patronStatus === 'paid_patron'
  )
    ? 'active'
    : 'inactive'

  return {
    patreonUserId,
    membershipId,
    subscriptionStatus,
  }
}

const patreon_oauth: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const protectedOpts = {
    ...rootOpts,
    ...DEFAULT_ROUTE_OPTIONS,
  }

  const callbackOpts = {
    ...rootOpts,
    ...PUBLIC_ROUTE_OPTIONS,
  }

  // Authenticated route to start Patreon OAuth link flow.
  fastify.get<{ Querystring: IStartQuery }>('/patreon/oauth/start', protectedOpts, async (
    req,
    reply: FastifyReply
  ) => {
    const uid = req.usr?._id
    const returnOrigin = normalize_origin(req.query.returnOrigin)
      || normalize_origin(req.headers.origin)

    if (!uid) {
      reply.redirect(to_callback_redirect_url(returnOrigin, 'error:authentication_required'))
      return
    }

    if (!is_patreon_oauth_configured()) {
      reply.redirect(to_callback_redirect_url(returnOrigin, 'error:not_configured'))
      return
    }

    const state = encode_state({
      uid: String(uid),
      iat: Date.now(),
      nonce: crypto.randomBytes(12).toString('base64url'),
      returnOrigin: returnOrigin
    })

    const authUrl = new URL(PATREON_AUTH_URL)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', Config.PATREON_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', get_redirect_uri())
    authUrl.searchParams.set('scope', 'identity identity[email]')
    authUrl.searchParams.set('state', state)

    reply.redirect(authUrl.toString())
  })

  // Public callback route (state is signed and carries user binding).
  fastify.get<{ Querystring: ICallbackQuery }>('/patreon/oauth/callback', callbackOpts, async (
    req,
    reply: FastifyReply
  ) => {
    if (!is_patreon_oauth_configured()) {
      reply.redirect(to_callback_redirect_url(undefined, 'error:not_configured'))
      return
    }

    const { code, state, error, error_description } = req.query
    if (error) {
      reply.redirect(to_callback_redirect_url(undefined, `error:${error}${error_description ? `:${error_description}` : ''}`))
      return
    }

    if (!code || !state) {
      reply.redirect(to_callback_redirect_url(undefined, 'error:missing_code_or_state'))
      return
    }

    const statePayload = decode_and_validate_state(state)
    if (!statePayload) {
      reply.redirect(to_callback_redirect_url(undefined, 'error:invalid_state'))
      return
    }

    try {
      const accessToken = await exchange_code_for_token(code)
      if (!accessToken) {
        reply.redirect(to_callback_redirect_url(statePayload.returnOrigin, 'error:token_exchange_failed'))
        return
      }

      const identity = await fetch_identity(accessToken)
      if (!identity?.patreonUserId) {
        reply.redirect(to_callback_redirect_url(statePayload.returnOrigin, 'error:identity_fetch_failed'))
        return
      }

      const existingLinkedUser = await UserModel.findOne({
        _id: { $ne: statePayload.uid },
        patreon_user_id: identity.patreonUserId,
        is_active: { $ne: false }
      }).select('_id')

      if (existingLinkedUser) {
        reply.redirect(to_callback_redirect_url(statePayload.returnOrigin, 'error:patreon_already_linked'))
        return
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: statePayload.uid, is_active: { $ne: false } },
        {
          patreon_user_id: identity.patreonUserId,
          patreon_membership_id: identity.membershipId,
          patreon_subscription_status: identity.subscriptionStatus,
          patreon_last_event: 'oauth_link',
          modified_at: new Date()
        },
        { new: true }
      )

      if (!updatedUser) {
        reply.redirect(to_callback_redirect_url(statePayload.returnOrigin, 'error:user_not_found'))
        return
      }

      USER_CACHE.del(updatedUser.name)
      reply.redirect(to_callback_redirect_url(statePayload.returnOrigin, 'connected'))
    } catch (e) {
      ler('[patreon_oauth] callback failed')
      dbug(e)
      reply.redirect(to_callback_redirect_url(statePayload.returnOrigin, 'error:internal_error'))
    }
  })
}

export default patreon_oauth
