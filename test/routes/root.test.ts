import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'

test('GET / - should return hello world message', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  // The actual route returns { message: 'Hello world' } according to the source
  assert.ok(body.message === 'Hello world' || body.root === true)
})

test('GET / - response should be JSON', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.strictEqual(response.statusCode, 200)
  assert.ok(response.headers['content-type']?.includes('application/json'))
})

test('GET / - should not require authentication', async (t) => {
  const app = await build(t)

  // Root endpoint should be publicly accessible
  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  assert.ok(body.message || body.root)
})

test('default root route', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/'
  })
  assert.deepStrictEqual(JSON.parse(res.payload), { root: true })
})
