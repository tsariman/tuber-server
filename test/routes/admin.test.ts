import { test } from 'node:test'
import * as assert from 'node:assert'
import {
  build,
  generateTestAuthForRole,
  getAuthHeaders,
} from '../helper'

test('POST /admin/twitch/renew-access-token - requires authentication', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/admin/twitch/renew-access-token',
  })

  assert.strictEqual(response.statusCode, 401)
})

test('POST /admin/twitch/renew-access-token - forbids non-admin roles', async (t) => {
  const app = await build(t)
  const { token } = await generateTestAuthForRole(app, 'free')
  assert.ok(token)

  const response = await app.inject({
    method: 'POST',
    url: '/admin/twitch/renew-access-token',
    headers: getAuthHeaders(token as string),
    payload: {},
  })

  assert.strictEqual(response.statusCode, 403)
})

test('POST /admin/twitch/renew-access-token - enforces maintenance secret when configured', async (t) => {
  const previousSecret = process.env.ADMIN_TWITCH_RENEWAL_SECRET
  process.env.ADMIN_TWITCH_RENEWAL_SECRET = 'top-secret-token'

  const app = await build(t)
  const { token } = await generateTestAuthForRole(app, 'administrator')
  assert.ok(token)

  const missingHeaderResponse = await app.inject({
    method: 'POST',
    url: '/admin/twitch/renew-access-token',
    headers: getAuthHeaders(token as string),
    payload: {},
  })

  assert.strictEqual(missingHeaderResponse.statusCode, 403)

  const wrongHeaderResponse = await app.inject({
    method: 'POST',
    url: '/admin/twitch/renew-access-token',
    headers: {
      ...getAuthHeaders(token as string),
      'x-admin-maintenance-secret': 'wrong-secret',
    },
    payload: {},
  })

  assert.strictEqual(wrongHeaderResponse.statusCode, 403)

  process.env.ADMIN_TWITCH_RENEWAL_SECRET = previousSecret
})
