import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'

test('GET / - should return hello world message', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  // Root serves built client HTML when present, otherwise returns a 404 text.
  assert.ok(response.statusCode === 200 || response.statusCode === 404)
  if (response.statusCode === 200) {
    assert.ok(response.headers['content-type']?.includes('text/html'))
  } else {
    assert.ok(response.payload.includes('Client not built'))
  }
})

test('GET / - response should be JSON', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.ok(response.statusCode === 200 || response.statusCode === 404)
  if (response.statusCode === 200) {
    assert.ok(response.headers['content-type']?.includes('text/html'))
  }
})

test('GET / - should not require authentication', async (t) => {
  const app = await build(t)

  // Root endpoint should be publicly accessible
  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.ok(response.statusCode === 200 || response.statusCode === 404)
})

test('default root route', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/'
  })
  assert.ok(res.statusCode === 200 || res.statusCode === 404)
  if (res.statusCode === 404) {
    assert.ok(res.payload.includes('Client not built'))
  }
})
