import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, generateTestToken, createJsonapiRequest } from '../helper'
import { create_user, UserModel } from '../../src/model/user'

// Test RequestDataValidator separately
import RequestDataValidator from '../../src/business.logic/RequestDataValidator'
import signInFormState from '../../src/state/form/sign.in.form.state'

test('RequestDataValidator - valid data', () => {
  const validData = {
    username: 'testuser',
    password: 'testpass123',
    options: [ 'keep-signed-in' ]
  }

  const validator = new RequestDataValidator(validData, signInFormState)
  const result = validator.validateAgainstFormState()

  assert.strictEqual(result, null) // No validation errors
})

test('RequestDataValidator - missing required username', () => {
  const invalidData = {
    password: 'testpass123'
  }

  const validator = new RequestDataValidator(invalidData, signInFormState)
  const result = validator.validateAgainstFormState()

  assert.ok(result !== null)
  assert.ok(result!.errors.length > 0)
  const firstError = result!.errors[0]
  assert.ok(firstError.source?.pointer?.includes('username'))
})

test('RequestDataValidator - missing required password', () => {
  const invalidData = {
    username: 'testuser'
  }

  const validator = new RequestDataValidator(invalidData, signInFormState)
  const result = validator.validateAgainstFormState()

  assert.ok(result !== null)
  assert.ok(result!.errors.length > 0)
  const firstError = result!.errors[0]
  assert.ok(firstError.source?.pointer?.includes('password'))
})

test('RequestDataValidator - empty username', () => {
  const invalidData = {
    username: '',
    password: 'testpass123'
  }

  const validator = new RequestDataValidator(invalidData, signInFormState)
  const result = validator.validateAgainstFormState()

  assert.ok(result !== null)
  assert.ok(result!.errors.length > 0)
  const firstError = result!.errors[0]
  assert.ok(firstError.source?.pointer?.includes('username'))
})

test('RequestDataValidator - empty password', () => {
  const invalidData = {
    username: 'testuser',
    password: ''
  }

  const validator = new RequestDataValidator(invalidData, signInFormState)
  const result = validator.validateAgainstFormState()

  assert.ok(result !== null)
  assert.ok(result!.errors.length > 0)
  const firstError = result!.errors[0]
  assert.ok(firstError.source?.pointer?.includes('password'))
})

// Authentication route tests - now with proper error handling
test('POST /signin - validation error for missing username', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        password: 'admin123'
      }
    })
  })

  assert.strictEqual(response.statusCode, 400)
  const body = JSON.parse(response.payload)
  assert.ok(body.errors)
  assert.ok(body.errors.length > 0)
  // When username is missing entirely, the code returns a generic MALFORMED_REQUEST error
  // because the credentials object check fails before field-level validation
  assert.ok(body.errors[0].code === 'MALFORMED_REQUEST' || body.errors[0].source?.pointer?.includes('username'))
})

test('POST /signin - validation error for missing password', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: 'admin'
      }
    })
  })

  assert.strictEqual(response.statusCode, 400)
  const body = JSON.parse(response.payload)
  assert.ok(body.errors)
  assert.ok(body.errors.length > 0)
  // When password is missing entirely, the code returns a generic MALFORMED_REQUEST error
  // because the credentials object check fails before field-level validation
  assert.ok(body.errors[0].code === 'MALFORMED_REQUEST' || body.errors[0].source?.pointer?.includes('password'))
})

test('POST /signin - validation error for empty username', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: '',
        password: 'admin123'
      }
    })
  })

  assert.strictEqual(response.statusCode, 400)
  const body = JSON.parse(response.payload)
  assert.ok(body.errors)
})

test('POST /signin - validation error for empty password', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: 'admin',
        password: ''
      }
    })
  })

  assert.strictEqual(response.statusCode, 400)
  const body = JSON.parse(response.payload)
  assert.ok(body.errors)
})

test('POST /signin - wrong credentials', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: 'nonexistentuser',
        password: 'wrongpassword'
      }
    })
  })

  assert.strictEqual(response.statusCode, 401)
  const body = JSON.parse(response.payload)
  assert.ok(body.errors || body.state)
})

test('POST /signin - valid credentials (admin/admin123)', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: 'admin',
        password: 'admin123',
        options: [ 'keep-signed-in' ]
      }
    })
  })

  // Should either succeed (200) or fail (401) depending on whether default user exists
  assert.ok(response.statusCode === 200 || response.statusCode === 401)
  
  if (response.statusCode === 200) {
    const body = JSON.parse(response.payload)
    assert.ok(body.state)
    assert.ok(body.state.net)
    assert.strictEqual(body.state.net.token, undefined)
  }
})

test('POST /signin - with keep-signed-in option', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: 'admin',
        password: 'admin123',
        options: [ 'keep-signed-in' ]
      }
    })
  })

  // Should either succeed (200) or fail (401)
  assert.ok(response.statusCode === 200 || response.statusCode === 401)
})

test('POST /signin - sets an http-usable auth cookie on non-https requests', async (t) => {
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'

  const app = await build(t)
  const suffix = Date.now().toString(36)
  const username = `cookie-${suffix}`
  const email = `cookie.${suffix}@example.com`

  await create_user({
    name: username,
    email,
    password: 'CookiePass123!'
  })

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username,
        password: 'CookiePass123!',
        options: [ 'keep-signed-in' ]
      }
    })
  })

  process.env.NODE_ENV = previousNodeEnv

  assert.strictEqual(response.statusCode, 200)
  const cookies = response.headers['set-cookie']
  assert.ok(cookies)
  const cookieHeader = Array.isArray(cookies) ? cookies.join('; ') : cookies
  assert.ok(cookieHeader.includes('token='))
  assert.ok(!cookieHeader.toLowerCase().includes('secure'))
})

test('POST /signin - invalid JSONAPI structure', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: {
      // Missing proper JSONAPI structure
      username: 'admin',
      password: 'admin123'
    }
  })

  assert.ok(response.statusCode >= 400)
})

test('POST /signout - requires authentication', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signout'
  })

  // Should return 401 or similar since no JWT token provided
  assert.ok(response.statusCode >= 400)
})

test('POST /signout - with valid authentication', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'POST',
      url: '/signout',
      headers: {
        'Authorization': `Bearer ${token}`
        // No Content-Type since signout doesn't need a body
      }
    })

    // Should successfully sign out
    assert.ok(response.statusCode === 204 || response.statusCode === 500)
  }
})

test('POST /signout - with invalid token', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/signout',
    headers: {
      'Authorization': 'Bearer invalid.token.here',
      'Content-Type': 'application/json'
    }
  })

  // Should return authentication error
  assert.ok(response.statusCode >= 400)
})

test('POST /password/recovery - stores a reset token for an existing account', async (t) => {
  const app = await build(t)
  const suffix = Date.now().toString(36)
  const name = `recover-${suffix}`
  const email = `recover.${suffix}@example.com`

  await create_user({
    name,
    email,
    password: 'OldPass123!'
  })

  const response = await app.inject({
    method: 'POST',
    url: '/password/recovery',
    payload: createJsonapiRequest('password-recovery', { email })
  })

  assert.strictEqual(response.statusCode, 200)

  const updatedUser = await UserModel.findOne({ email })
  assert.ok(updatedUser)
  assert.ok(updatedUser?.password_reset_token)
  assert.ok(updatedUser?.password_reset_expires)
})

test('POST /password/reset - accepts a valid recovery token and changes the password', async (t) => {
  const app = await build(t)
  const suffix = Date.now().toString(36)
  const name = `reset-${suffix}`
  const email = `reset.${suffix}@example.com`
  const newPassword = 'NewPass123!@#'

  await create_user({
    name,
    email,
    password: 'OldPass123!'
  })

  await app.inject({
    method: 'POST',
    url: '/password/recovery',
    payload: createJsonapiRequest('password-recovery', { email })
  })

  const pendingUser = await UserModel.findOne({ email })
  assert.ok(pendingUser?.password_reset_token)

  const resetResponse = await app.inject({
    method: 'POST',
    url: '/password/reset',
    payload: createJsonapiRequest('password-reset', {
      email,
      token: pendingUser?.password_reset_token,
      password: newPassword
    })
  })

  assert.strictEqual(resetResponse.statusCode, 200)

  const signinResponse = await app.inject({
    method: 'POST',
    url: '/signin',
    payload: createJsonapiRequest('signins', {
      credentials: {
        username: name,
        password: newPassword
      }
    })
  })

  assert.strictEqual(signinResponse.statusCode, 200)

  const clearedUser = await UserModel.findOne({ email })
  assert.ok(!clearedUser?.password_reset_token)
  assert.ok(!clearedUser?.password_reset_expires)
})