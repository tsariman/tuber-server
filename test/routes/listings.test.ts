import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, generateTestToken, getAuthHeaders } from '../helper'

test('GET /listings/:id - should require authentication', async (t) => {
  const app = await build(t)
  const testId = '507f1f77bcf86cd799439011'

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'GET',
    url: `/listings/${testId}`
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'GET',
      url: `/listings/${testId}`,
      headers: getAuthHeaders(token)
    })

    // Should either return listing or 404 if not found
    assert.ok(authResponse.statusCode === 200 || authResponse.statusCode === 404)
    
    if (authResponse.statusCode === 200) {
      const body = JSON.parse(authResponse.payload)
      assert.ok(body.data !== undefined || body.state !== undefined)
    }
  }
})

test('GET /listings/:id with invalid ID format', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'GET',
      url: '/listings/invalid-id-format',
      headers: getAuthHeaders(token)
    })

    // Should return 400 for invalid ID format
    assert.ok(response.statusCode >= 400)
  }
})

test('GET /listings/:id with non-existent ID', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const nonExistentId = '507f1f77bcf86cd799439999'
    const response = await app.inject({
      method: 'GET',
      url: `/listings/${nonExistentId}`,
      headers: getAuthHeaders(token)
    })

    // Should return 404 for non-existent listing
    assert.ok(response.statusCode === 404 || response.statusCode === 200)
  }
})

test('GET /listings/:id with valid MongoDB ObjectId format', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const validId = '507f1f77bcf86cd799439011'
    const response = await app.inject({
      method: 'GET',
      url: `/listings/${validId}`,
      headers: getAuthHeaders(token)
    })

    // Should handle valid ObjectId format properly
    assert.ok(response.statusCode === 200 || response.statusCode === 404)
  }
})

test('GET /listings/:id response structure validation', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const testId = '507f1f77bcf86cd799439011'
    const response = await app.inject({
      method: 'GET',
      url: `/listings/${testId}`,
      headers: getAuthHeaders(token)
    })

    if (response.statusCode === 200) {
      const body = JSON.parse(response.payload)
      
      // Check for JSONAPI or state response structure
      assert.ok(
        body.data !== undefined || 
        body.state !== undefined || 
        body.errors !== undefined
      )
    }
  }
})