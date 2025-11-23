import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, generateTestToken, getAuthHeaders, mockUser } from '../helper'
import { UserModel } from '../../src/model/user'
import { BookmarkModel } from '../../src/model/bookmark'

/** Utility to create a user document if it does not already exist */
async function ensureUser() {
  const existing = await UserModel.findById(mockUser._id)
  if (existing) return existing
  return await UserModel.create({
    _id: mockUser._id,
    name: mockUser.name,
    email: mockUser.email
  })
}

/** Utility to create a bookmark for vote flow tests */
async function createBookmark() {
  const bm = await BookmarkModel.create({
    user_id: mockUser._id,
    platform: 'youtube',
    start_seconds: 0,
    title: 'Vote Flow Test Bookmark',
    videoid: 'voteFlowVid'
  })
  return bm
}

// Complete vote lifecycle test
// - Initial GET (no vote)
// - Upvote
// - GET verification
// - Switch to downvote
// - GET verification
// - Toggle off downvote
// - GET verification (rating null)
// - Downvote again
// - DELETE vote
// - Final GET verification

test('Bookmark vote lifecycle', async (t) => {
  const app = await build(t)
  // Wait for fastify readiness (plugins, DB connect, etc.)
  await app.ready()
  await ensureUser()
  const bookmark = await createBookmark()
  const token = await generateTestToken(app)
  assert.ok(token, 'Token should be generated')
  const headers = getAuthHeaders(token!)
  const authOnly = { Authorization: headers.Authorization }

  // Initial GET (no vote)
  let response = await app.inject({
      method: 'GET',
      url: `/bookmarks/${bookmark._id}/vote`,
      headers: authOnly
  })
  assert.strictEqual(response.statusCode, 200)
  let body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 0)
  assert.strictEqual(body.data.attributes.downvotes, 0)
  assert.strictEqual(body.data.attributes.rating, null)

  // Upvote
  response = await app.inject({
    method: 'PUT',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers,
    payload: {
      data: { type: 'bookmark-vote', attributes: { rating: 1 } }
    }
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 1)
  assert.strictEqual(body.data.attributes.downvotes, 0)
  assert.strictEqual(body.data.attributes.rating, 1)

  // GET verify upvote
  response = await app.inject({
    method: 'GET',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers: authOnly
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 1)
  assert.strictEqual(body.data.attributes.downvotes, 0)
  assert.strictEqual(body.data.attributes.rating, 1)

  // Switch to downvote
  response = await app.inject({
    method: 'PUT',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers,
    payload: {
      data: { type: 'bookmark-vote', attributes: { rating: -1 } }
    }
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 0)
  assert.strictEqual(body.data.attributes.downvotes, 1)
  assert.strictEqual(body.data.attributes.rating, -1)

  // Toggle off downvote (same vote again)
  response = await app.inject({
    method: 'PUT',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers,
    payload: {
      data: { type: 'bookmark-vote', attributes: { rating: -1 } }
    }
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 0)
  assert.strictEqual(body.data.attributes.downvotes, 0)
  assert.strictEqual(body.data.attributes.rating, null)

  // Downvote again (re-add)
  response = await app.inject({
    method: 'PUT',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers,
    payload: {
      data: { type: 'bookmark-vote', attributes: { rating: -1 } }
    }
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 0)
  assert.strictEqual(body.data.attributes.downvotes, 1)
  assert.strictEqual(body.data.attributes.rating, -1)

  // DELETE vote
  response = await app.inject({
    method: 'DELETE',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers: authOnly
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 0)
  assert.strictEqual(body.data.attributes.downvotes, 0)
  assert.strictEqual(body.data.attributes.rating, null)

  // Final GET verification
  response = await app.inject({
    method: 'GET',
    url: `/bookmarks/${bookmark._id}/vote`,
    headers: authOnly
  })
  assert.strictEqual(response.statusCode, 200)
  body = JSON.parse(response.payload)
  assert.strictEqual(body.data.attributes.upvotes, 0)
  assert.strictEqual(body.data.attributes.downvotes, 0)
  assert.strictEqual(body.data.attributes.rating, null)
})
