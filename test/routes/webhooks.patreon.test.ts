import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'
import { UserModel } from '../../src/model/user'

type TPatreonEvent = 'members:create' | 'members:update' | 'members:delete'

const uniqueSuffix = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const createWebhookPayload = ({
  event,
  membershipId,
  patreonUserId,
  email,
  patronStatus,
  entitledAmountCents,
  tierIds,
}: {
  event: TPatreonEvent
  membershipId: string
  patreonUserId: string
  email: string
  patronStatus?: string
  entitledAmountCents?: number
  tierIds?: string[]
}) => ({
  data: {
    id: membershipId,
    type: 'member',
    attributes: {
      patron_status: patronStatus,
      currently_entitled_amount_cents: entitledAmountCents,
    },
    relationships: {
      user: {
        data: {
          id: patreonUserId,
          type: 'user',
        }
      },
      currently_entitled_tiers: {
        data: (tierIds ?? []).map(id => ({
          id,
          type: 'tier',
        }))
      }
    }
  },
  included: [
    {
      id: patreonUserId,
      type: 'user',
      attributes: {
        email,
      }
    }
  ]
})

test('POST /webhooks/patreon upgrades free user to supporter on members:create', async (t) => {
  const app = await build(t)
  const suffix = uniqueSuffix()
  const email = `patreon-upgrade-${suffix}@example.com`
  const patreonUserId = `patreon-user-${suffix}`
  const membershipId = `membership-${suffix}`
  const secret = `secret-${suffix}`
  const previousSecret = process.env.PATREON_WEBHOOK_SECRET

  process.env.PATREON_WEBHOOK_SECRET = secret
  try {
    const user = await UserModel.create({
      name: `patreonfree${suffix}`,
      email,
      role: 'free',
    })

    const jwtVersionBefore = user.jwt_version ?? 0

    const response = await app.inject({
      method: 'POST',
      url: '/webhooks/patreon',
      headers: {
        'content-type': 'application/json',
        'x-patreon-event': 'members:create',
        'x-tuber-webhook-secret': secret,
      },
      payload: createWebhookPayload({
        event: 'members:create',
        membershipId,
        patreonUserId,
        email,
        patronStatus: 'active_patron',
        entitledAmountCents: 300,
        tierIds: ['tier-supporter'],
      })
    })

    assert.strictEqual(response.statusCode, 200)

    const updatedUser = await UserModel.findById(user._id)
    assert.ok(updatedUser)
    assert.strictEqual(updatedUser!.role, 'supporter')
    assert.strictEqual(updatedUser!.supporter_source, 'patreon')
    assert.strictEqual(updatedUser!.patreon_user_id, patreonUserId)
    assert.strictEqual(updatedUser!.patreon_membership_id, membershipId)
    assert.strictEqual(updatedUser!.patreon_subscription_status, 'active')
    assert.strictEqual(updatedUser!.patreon_last_event, 'members:create')
    assert.strictEqual(updatedUser!.jwt_version, jwtVersionBefore + 1)

    const body = JSON.parse(response.payload)
    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.sync.status, 'updated')
    assert.strictEqual(body.sync.roleBefore, 'free')
    assert.strictEqual(body.sync.roleAfter, 'supporter')
  } finally {
    process.env.PATREON_WEBHOOK_SECRET = previousSecret
    await UserModel.deleteMany({ email })
  }
})

test('POST /webhooks/patreon keeps supporter role active on members:update', async (t) => {
  const app = await build(t)
  const suffix = uniqueSuffix()
  const email = `patreon-update-${suffix}@example.com`
  const patreonUserId = `patreon-user-${suffix}`
  const membershipId = `membership-${suffix}`
  const secret = `secret-${suffix}`
  const previousSecret = process.env.PATREON_WEBHOOK_SECRET

  process.env.PATREON_WEBHOOK_SECRET = secret
  try {
    const user = await UserModel.create({
      name: `patreonmember${suffix}`,
      email,
      role: 'supporter',
      patreon_user_id: patreonUserId,
      patreon_membership_id: membershipId,
      patreon_subscription_status: 'active',
      patreon_last_event: 'members:create',
      supporter_source: 'patreon',
    })

    const jwtVersionBefore = user.jwt_version ?? 0

    const response = await app.inject({
      method: 'POST',
      url: '/webhooks/patreon',
      headers: {
        'content-type': 'application/json',
        'x-patreon-event': 'members:update',
        'x-tuber-webhook-secret': secret,
      },
      payload: createWebhookPayload({
        event: 'members:update',
        membershipId,
        patreonUserId,
        email,
        patronStatus: 'active_patron',
        entitledAmountCents: 300,
        tierIds: ['tier-supporter'],
      })
    })

    assert.strictEqual(response.statusCode, 200)

    const updatedUser = await UserModel.findById(user._id)
    assert.ok(updatedUser)
    assert.strictEqual(updatedUser!.role, 'supporter')
    assert.strictEqual(updatedUser!.supporter_source, 'patreon')
    assert.strictEqual(updatedUser!.patreon_subscription_status, 'active')
    assert.strictEqual(updatedUser!.patreon_last_event, 'members:update')
    assert.strictEqual(updatedUser!.jwt_version, jwtVersionBefore)

    const body = JSON.parse(response.payload)
    assert.strictEqual(body.ok, true)
    assert.ok(body.sync.status === 'updated' || body.sync.status === 'noop')
    assert.strictEqual(body.sync.roleAfter, 'supporter')
  } finally {
    process.env.PATREON_WEBHOOK_SECRET = previousSecret
    await UserModel.deleteMany({ email })
  }
})

test('POST /webhooks/patreon downgrades supporter to free on members:delete', async (t) => {
  const app = await build(t)
  const suffix = uniqueSuffix()
  const email = `patreon-delete-${suffix}@example.com`
  const patreonUserId = `patreon-user-${suffix}`
  const membershipId = `membership-${suffix}`
  const secret = `secret-${suffix}`
  const previousSecret = process.env.PATREON_WEBHOOK_SECRET

  process.env.PATREON_WEBHOOK_SECRET = secret
  try {
    const user = await UserModel.create({
      name: `patreonsupporter${suffix}`,
      email,
      role: 'supporter',
      patreon_user_id: patreonUserId,
      patreon_membership_id: membershipId,
      patreon_subscription_status: 'active',
      patreon_last_event: 'members:update',
      supporter_source: 'patreon',
    })

    const jwtVersionBefore = user.jwt_version ?? 0

    const response = await app.inject({
      method: 'POST',
      url: '/webhooks/patreon',
      headers: {
        'content-type': 'application/json',
        'x-patreon-event': 'members:delete',
        'x-tuber-webhook-secret': secret,
      },
      payload: createWebhookPayload({
        event: 'members:delete',
        membershipId,
        patreonUserId,
        email,
        patronStatus: 'former_patron',
        entitledAmountCents: 0,
        tierIds: [],
      })
    })

    assert.strictEqual(response.statusCode, 200)

    const updatedUser = await UserModel.findById(user._id)
    assert.ok(updatedUser)
    assert.strictEqual(updatedUser!.role, 'free')
    assert.strictEqual(updatedUser!.supporter_source, undefined)
    assert.strictEqual(updatedUser!.patreon_user_id, patreonUserId)
    assert.strictEqual(updatedUser!.patreon_membership_id, membershipId)
    assert.strictEqual(updatedUser!.patreon_subscription_status, 'inactive')
    assert.strictEqual(updatedUser!.patreon_last_event, 'members:delete')
    assert.strictEqual(updatedUser!.jwt_version, jwtVersionBefore + 1)

    const body = JSON.parse(response.payload)
    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.sync.status, 'updated')
    assert.strictEqual(body.sync.roleBefore, 'supporter')
    assert.strictEqual(body.sync.roleAfter, 'free')
  } finally {
    process.env.PATREON_WEBHOOK_SECRET = previousSecret
    await UserModel.deleteMany({ email })
  }
})