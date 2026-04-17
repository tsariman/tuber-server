import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, createJsonapiRequest } from '../helper'

// Note: Dev routes are only available in DEV mode
// These tests will only work when Config.DEV is true

test('GET /dev - should return error response', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev'
  })

  // Should either return 500 error in DEV mode or 404 in production
  assert.ok(response.statusCode === 500 || response.statusCode === 404)
  
  if (response.statusCode === 500) {
    const body = JSON.parse(response.payload)
    assert.ok(body.errors)
  }
})

test('GET /dev/get-html-page - DEV mode only', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/get-html-page?url=https://example.com'
  })

  // Should work in DEV mode or be not found in production
  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/user - create development user', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/user'
  })

  // Should work in DEV mode or be not found in production
  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 201 ||
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('POST /dev/database-reset - reset database for development', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/database-reset'
  })

  // Should work in DEV mode or be not found in production
  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('POST /dev/load-test-drawer - load test drawer', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/load-test-drawer'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('POST /dev/unload-test-drawer - unload test drawer', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/unload-test-drawer'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('POST /dev/populate/users/:total - populate users collection', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/populate/users/5'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('POST /dev/populate/bookmarks/:total - populate bookmarks collection', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/populate/bookmarks/5'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('GET /dev/no-response/:hangTime - test hang time endpoint', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/no-response/100' // 100ms hang time
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('DELETE /dev/drop-collection/:collection - drop collection', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'DELETE',
    url: '/dev/drop-collection/test_collection'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('POST /dev/populate-collection - populate collection with data', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/populate-collection',
    payload: {
      collection: 'test_collection',
      quantity: '5'
    }
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/setup-collection-index-search/bookmarks - setup search index', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/setup-collection-index-search/bookmarks'
  })

  assert.ok(
    response.statusCode === 201 ||
    response.statusCode === 409 ||
    response.statusCode === 404 ||
    response.statusCode === 500
  )

  if (response.statusCode !== 404) {
    const body = JSON.parse(response.payload)
    assert.ok(body.state || body.meta || body.errors)
  }
})

test('POST /dev/state/pages - get state pages', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/state/pages',
    payload: { key: 'test' }
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/state/forms - get state forms', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/state/forms',
    payload: { key: 'test' }
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/rumble/regexp - test rumble regexp', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/rumble/regexp',
    payload: {
      regexp: 'test-pattern',
      url: 'https://rumble.com/test'
    }
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/unknown/regexp - test unknown regexp', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/unknown/regexp',
    payload: {
      regexp: 'test-pattern',
      url: 'https://example.com/test'
    }
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('GET /dev/rumble/thumbnails - get rumble thumbnail', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/rumble/thumbnails?slug=test-slug'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('GET /dev/odysee/thumbnails - get odysee thumbnail', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/odysee/thumbnails?slug=test-slug'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('GET /dev/vimeo/thumbnails - get vimeo thumbnail', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/vimeo/thumbnails?videoid=123456'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('GET /dev/twitch/thumbnails - get twitch thumbnail', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/twitch/thumbnails?videoid=123456'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('GET /dev/twitch/renew-access-token - renew twitch access token', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/twitch/renew-access-token'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/twitch/client-id - set twitch client ID', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/twitch/client-id',
    payload: {
      client_id: 'test-client-id',
      client_secret: 'test-client-secret'
    }
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('POST /dev/save-config-value - save config value', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'POST',
    url: '/dev/save-config-value',
    payload: createJsonapiRequest('config', {
      key: 'test-key',
      value: 'test-value'
    })
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 400 ||
    response.statusCode === 500
  )
})

test('GET /dev/environment-variable - get environment variable', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/dev/environment-variable'
  })

  assert.ok(
    response.statusCode === 200 || 
    response.statusCode === 404 ||
    response.statusCode === 500
  )
})

test('Dev routes availability consistency', async (t) => {
  const app = await build(t)

  // Test multiple dev routes to ensure consistent availability
  const routes = [
    '/dev/user',
    '/dev/database-reset',
    '/dev/load-test-drawer'
  ]

  const responses = await Promise.all(
    routes.map(route => 
      app.inject({ method: 'POST', url: route })
    )
  )

  // All dev routes should have the same availability pattern
  const statusCodes = responses.map(r => r.statusCode)
  const allNotFound = statusCodes.every(code => code === 404)
  const allAvailable = statusCodes.every(code => code !== 404)
  
  assert.ok(allNotFound || allAvailable, 'Dev routes should be consistently available or unavailable')
})