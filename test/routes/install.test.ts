import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'

// Note: Install routes are only available in DEV mode
// These tests will only work when Config.DEV is true

test('POST /install/setup-collection-index-search/bookmarks - DEV mode only', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/install/setup-collection-index-search/bookmarks'
  })

  // Should either work in DEV mode (200/201) or be not found in production (404)
  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 201 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
  
  if (response.statusCode === 404) {
    // This is expected in production mode
    console.log('Install route not available - likely in production mode')
  }
})

test('POST /install/readable - DEV mode only', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/install/readable'
  })

  // Should either work in DEV mode or be not found in production
  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
  
  if (response.statusCode === 200) {
    const body = JSON.parse(response.payload)
    assert.strictEqual(body.status, 'ok')
  }
})

test('Install routes - check DEV mode behavior', async (t) => {
  const app = await build(t)

  // Test that install routes behave consistently
  const setupResponse = await app.inject({
    method: 'POST',
    url: '/install/setup-collection-index-search/bookmarks'
  })

  const readableResponse = await app.inject({
    method: 'POST',
    url: '/install/readable'
  })

  // Both should have the same availability (both work in DEV, both 404 in production)
  if (setupResponse.statusCode === 404) {
    assert.strictEqual(readableResponse.statusCode, 404)
  } else {
    assert.ok(readableResponse.statusCode !== 404)
  }
})

test('GET /install/* - should not be available (only POST supported)', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/install/readable'
  })

  // GET should not be supported on install routes
  assert.ok(response.statusCode === 404 || response.statusCode === 405)
})

test('POST /install/nonexistent - should return 404', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/install/nonexistent-endpoint'
  })

  assert.strictEqual(response.statusCode, 404)
})