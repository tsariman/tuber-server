import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { PUBLIC_ROUTE_OPTIONS } from '../middleware/router.option'
import { sync_user_supporter_role_from_patreon } from '../model/user'
import { is_record } from '../utility'
import { dbug, ler } from '../utility/logging'

interface IPatreonIdentity {
  userId?: string
  email?: string
  membershipId?: string
  tierIds: string[]
}

interface IPatreonStatus {
  isActive: boolean
  reason: string
}

const ACTIVE_STATUSES = new Set(['active_patron', 'paid_patron'])
const INACTIVE_STATUSES = new Set(['former_patron', 'declined_patron'])
const INACTIVE_EVENTS = new Set(['members:delete', 'pledges:delete'])

const getHeaderValue = (
  value: string | string[] | undefined
): string | undefined => {
  if (typeof value === 'string') {
    return value
  }
  return value?.[0]
}

const to_string_array = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map(item => {
      if (is_record(item) && typeof item.id === 'string') {
        return item.id
      }
      return ''
    })
    .filter(Boolean)
}

const extract_identity = (payload: unknown): IPatreonIdentity => {
  if (!is_record(payload)) {
    return { tierIds: [] }
  }

  const data = is_record(payload.data) ? payload.data : {}
  const relationships = is_record(data.relationships) ? data.relationships : {}

  const relationshipUser = is_record(relationships.user) ? relationships.user : {}
  const relationshipUserData = is_record(relationshipUser.data) ? relationshipUser.data : {}

  const relationshipTiers = is_record(relationships.currently_entitled_tiers)
    ? relationships.currently_entitled_tiers
    : {}
  const relationshipTierData = relationshipTiers.data

  const included = Array.isArray(payload.included) ? payload.included : []
  const includedUser = included.find(item => {
    if (!is_record(item)) {
      return false
    }
    if (item.type !== 'user') {
      return false
    }
    return typeof item.id === 'string' && item.id === relationshipUserData.id
  })

  const includedUserAttributes = is_record(includedUser)
    && is_record(includedUser.attributes)
    ? includedUser.attributes
    : {}

  const email = typeof includedUserAttributes.email === 'string'
    ? includedUserAttributes.email.trim().toLowerCase()
    : undefined

  return {
    userId: typeof relationshipUserData.id === 'string' ? relationshipUserData.id : undefined,
    membershipId: typeof data.id === 'string' ? data.id : undefined,
    email,
    tierIds: to_string_array(relationshipTierData)
  }
}

const derive_subscription_status = (
  eventType: string,
  payload: unknown,
  tierIds: string[]
): IPatreonStatus => {
  if (INACTIVE_EVENTS.has(eventType)) {
    return { isActive: false, reason: 'inactive_event' }
  }

  if (!is_record(payload) || !is_record(payload.data) || !is_record(payload.data.attributes)) {
    return {
      isActive: tierIds.length > 0,
      reason: tierIds.length > 0 ? 'tiers_detected' : 'missing_attributes'
    }
  }

  const attributes = payload.data.attributes
  const patronStatus = typeof attributes.patron_status === 'string'
    ? attributes.patron_status
    : undefined
  const entitledAmount = typeof attributes.currently_entitled_amount_cents === 'number'
    ? attributes.currently_entitled_amount_cents
    : undefined

  if (patronStatus && ACTIVE_STATUSES.has(patronStatus)) {
    return { isActive: true, reason: `status:${patronStatus}` }
  }

  if (patronStatus && INACTIVE_STATUSES.has(patronStatus)) {
    return { isActive: false, reason: `status:${patronStatus}` }
  }

  if (typeof entitledAmount === 'number') {
    if (entitledAmount > 0) {
      return { isActive: true, reason: 'entitlement_amount' }
    }
    return { isActive: false, reason: 'zero_entitlement_amount' }
  }

  return {
    isActive: tierIds.length > 0,
    reason: tierIds.length > 0 ? 'tiers_detected' : 'no_subscription_signals'
  }
}

/**
 * Patreon webhook endpoint.
 *
 * Expected flow:
 * - Active subscription upgrades `free -> supporter`.
 * - Cancellation or inactive status downgrades `supporter -> free` when the
 *   supporter role was granted by Patreon automation.
 */
const patreon_webhooks: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const opts = {
    ...rootOpts,
    ...PUBLIC_ROUTE_OPTIONS,
  }

  fastify.post('/webhooks/patreon', opts, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const configuredSecret = process.env.PATREON_WEBHOOK_SECRET
      const receivedSecret = getHeaderValue(req.headers['x-tuber-webhook-secret'])

      if (configuredSecret && configuredSecret !== receivedSecret) {
        reply.code(401).send({ ok: false, reason: 'unauthorized_webhook' })
        return
      }

      const eventType = getHeaderValue(req.headers['x-patreon-event']) ?? 'unknown'
      const identity = extract_identity(req.body)

      if (!identity.userId && !identity.email) {
        reply.code(202).send({
          ok: true,
          event: eventType,
          result: 'ignored',
          reason: 'missing_user_identity'
        })
        return
      }

      const allowedTierIds = (process.env.PATREON_SUPPORTER_TIER_IDS ?? '')
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)

      const isTierAllowed = allowedTierIds.length === 0
        || identity.tierIds.some(tierId => allowedTierIds.includes(tierId))

      const derivedStatus = derive_subscription_status(eventType, req.body, identity.tierIds)
      const isActive = isTierAllowed && derivedStatus.isActive

      const syncResult = await sync_user_supporter_role_from_patreon({
        patreonUserId: identity.userId,
        email: identity.email,
        membershipId: identity.membershipId,
        event: eventType,
        isActive,
      })

      reply.code(200).send({
        ok: true,
        event: eventType,
        isActive,
        reason: derivedStatus.reason,
        sync: syncResult,
      })
    } catch (e) {
      ler('[patreon_webhook] failed to process webhook')
      dbug(e)
      reply.code(500).send({ ok: false, reason: 'internal_error' })
    }
  })
}

export default patreon_webhooks
