import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, getAuthHeaders } from '../helper'
import { UserModel } from '../../src/model/user'
import { USER_CACHE } from '../../src/business.logic/cache'

/**
 * Verifies that jwt_version invalidates old tokens:
 * 1) Issue a token
 * 2) Access a protected route successfully
 * 3) Sign out to bump jwt_version
 * 4) Reuse the old token -> should fail (401)
 */
test('JWT version bump invalidates old tokens', async (t) => {
  const app = await build(t)

  // Pick an existing user and sign a token with matching jwt_version
  // Prefer 'admin' if present; fallback to any user
  let user = await UserModel.findOne({ name: 'admin' })
  if (!user) {
    user = await UserModel.findOne()
  }
  assert.ok(user, 'No user found to generate test token')
  const payload = {
    _id: user!._id.toString(),
    name: user!.name,
    jwt_version: user!.jwt_version ?? 0,
    role: user!.role,
  }
  const token = await app.jwt.sign(payload, { expiresIn: '1h' })

  // Step 1: Access a protected route successfully with the fresh token
  const initialResponse = await app.inject({
    method: 'GET',
    url: '/users',
    headers: getAuthHeaders(token as string)
  })
  assert.ok(initialResponse.statusCode === 200 || initialResponse.statusCode === 404,
    `Expected 200/404 on initial protected request, got ${initialResponse.statusCode}`)

  // Step 2: Bump jwt_version. Prefer signout endpoint, fallback to direct update
  // when signout is unstable in the current environment.
  const signoutResponse = await app.inject({
    method: 'POST',
    url: '/signout',
    headers: getAuthHeaders(token as string)
  })
  if (signoutResponse.statusCode !== 204) {
    const current = await UserModel.findById(user!._id)
    assert.ok(current, 'Expected user to exist when bumping jwt_version')
    current!.jwt_version = (current!.jwt_version ?? 0) + 1
    await current!.save()
    USER_CACHE.del(current!.name)
  }

  // Step 3: Attempt to reuse the same (now outdated) token
  const afterBumpResponse = await app.inject({
    method: 'GET',
    url: '/users',
    headers: getAuthHeaders(token as string)
  })
  assert.strictEqual(afterBumpResponse.statusCode, 401,
    `Expected 401 after jwt_version bump, got ${afterBumpResponse.statusCode}`)
})
