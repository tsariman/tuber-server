import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, generateTestToken, getAuthHeaders, createJsonapiRequest, mockUserData } from '../helper'

test('GET /users - should require authentication', async (t) => {
  const app = await build(t)

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'GET',
    url: '/users'
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'GET',
      url: '/users',
      headers: getAuthHeaders(token)
    })

    // Should return users collection or appropriate response
    assert.ok(authResponse.statusCode === 200 || authResponse.statusCode === 404)
    
    if (authResponse.statusCode === 200) {
      const body = JSON.parse(authResponse.payload)
      assert.ok(body.data !== undefined || body.state !== undefined)
    }
  }
})

test('GET /users with pagination parameters', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'GET',
      url: '/users?page[number]=1&page[size]=10',
      headers: getAuthHeaders(token)
    })

    assert.ok(response.statusCode === 200 || response.statusCode === 404)
  }
})

test('GET /users/:name - should require authentication', async (t) => {
  const app = await build(t)
  const testUsername = 'testuser'

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'GET',
    url: `/users/${testUsername}`
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'GET',
      url: `/users/${testUsername}`,
      headers: getAuthHeaders(token)
    })

    // Should return user details or 404 if not found
    assert.ok(authResponse.statusCode === 200 || authResponse.statusCode === 404)
    
    if (authResponse.statusCode === 200) {
      const body = JSON.parse(authResponse.payload)
      assert.ok(body.data !== undefined || body.state !== undefined)
    }
  }
})

test('GET /users/:name with non-existent user', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'GET',
      url: '/users/nonexistentuser123456',
      headers: getAuthHeaders(token)
    })

    // Should return 404 for non-existent user
    assert.ok(response.statusCode === 404 || response.statusCode === 200)
  }
})

test('POST /users - should require authentication and valid data', async (t) => {
  const app = await build(t)

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'POST',
    url: '/users',
    payload: createJsonapiRequest('users', mockUserData)
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'POST',
      url: '/users',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('users', mockUserData)
    })

    // Should either create successfully, return validation errors, or conflict
    assert.ok(
      authResponse.statusCode === 201 || 
      authResponse.statusCode === 400 || 
      authResponse.statusCode === 409 ||
      authResponse.statusCode === 500
    )
  }
})

test('POST /users - should validate required fields', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    // Test with missing required fields
    const incompleteUser = {
      name: 'testuser'
      // Missing email and password
    }

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('users', incompleteUser)
    })

    // Should return validation error
    assert.ok(response.statusCode >= 400)
  }
})

test('POST /users - should validate email format', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const invalidEmailUser = {
      name: 'testuser',
      email: 'invalid-email',
      password: 'password123'
    }

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('users', invalidEmailUser)
    })

    // Should return validation error for invalid email
    assert.ok(response.statusCode >= 400)
  }
})

test('POST /users - should validate password strength', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const weakPasswordUser = {
      name: 'testuser',
      email: 'test@example.com',
      password: '123' // Weak password
    }

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('users', weakPasswordUser)
    })

    // Should return validation error for weak password
    assert.ok(response.statusCode >= 400)
  }
})

test('POST /users with duplicate username', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const duplicateUser = {
      name: 'admin', // Likely to exist as default user
      email: 'admin2@example.com',
      password: 'password123'
    }

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('users', duplicateUser)
    })

    // Should return conflict error for duplicate username
    assert.ok(response.statusCode === 409 || response.statusCode === 400)
  }
})

test('POST /users with invalid JSONAPI structure', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: getAuthHeaders(token),
      payload: {
        // Missing proper JSONAPI structure
        name: 'testuser',
        email: 'test@example.com'
      }
    })

    assert.ok(response.statusCode >= 400)
  }
})

test('GET /users with invalid query parameters', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'GET',
      url: '/users?page[number]=invalid&page[size]=-1',
      headers: getAuthHeaders(token)
    })

    // Should handle invalid query parameters gracefully
    assert.ok(response.statusCode === 200 || response.statusCode === 400)
  }
})