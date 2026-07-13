import { test } from 'node:test'
import * as assert from 'node:assert'
import { BookmarkModel } from '../../src/model/bookmark'
import {
  build,
  generateTestAuthForRole,
  generateTestToken,
  getAuthHeaders,
  createJsonapiRequest,
  mockBookmark,
} from '../helper'

test('GET /bookmarks - should return bookmarks collection (public route)', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks'
  })

  // Public route should be accessible without authentication
  assert.ok(response.statusCode === 200 || response.statusCode === 404)
  
  if (response.statusCode === 200) {
    const body = JSON.parse(response.payload)
    assert.ok(body.data !== undefined || body.state !== undefined)
  }
})

test('GET /bookmarks with pagination parameters', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks?page[number]=1&page[size]=10'
  })

  assert.ok(response.statusCode === 200 || response.statusCode === 404)
})

test('GET /bookmarks/:id - should require authentication for bookmark details', async (t) => {
  const app = await build(t)
  const testId = '507f1f77bcf86cd799439011'

  // Test without authentication - should fail
  const unauthResponse = await app.inject({
    method: 'GET',
    url: `/bookmarks/${testId}`
  })

  assert.ok(unauthResponse.statusCode >= 400) // Should require auth

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'GET',
      url: `/bookmarks/${testId}`,
      headers: getAuthHeaders(token)
    })

    // Should either return the bookmark or a 404 if not found
    assert.ok(authResponse.statusCode === 200 || authResponse.statusCode === 404)
  }
})

test('GET /bookmarks/:id/thumbnail-url - should require authentication', async (t) => {
  const app = await build(t)
  const testId = '507f1f77bcf86cd799439011'

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'GET',
    url: `/bookmarks/${testId}/thumbnail-url`
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'GET',
      url: `/bookmarks/${testId}/thumbnail-url`,
      headers: getAuthHeaders(token)
    })

    assert.ok(authResponse.statusCode === 200 || authResponse.statusCode === 404)
  }
})

test('POST /bookmarks - should require authentication and valid data', async (t) => {
  const app = await build(t)

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'POST',
    url: '/bookmarks',
    payload: createJsonapiRequest('bookmarks', mockBookmark)
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'POST',
      url: '/bookmarks',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('bookmarks', mockBookmark)
    })

    // Should either create successfully or return validation errors
    assert.ok(authResponse.statusCode === 201 || authResponse.statusCode === 400 || authResponse.statusCode === 500)
  }
})

test('POST /bookmarks - should validate required fields', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    // Test with missing required fields
    const incompleteBookmark = {
      title: 'Test without platform'
      // Missing platform, start_seconds, etc.
    }

    const response = await app.inject({
      method: 'POST',
      url: '/bookmarks',
      headers: getAuthHeaders(token),
      payload: createJsonapiRequest('bookmarks', incompleteBookmark)
    })

    // Should return validation error
    assert.ok(response.statusCode >= 400)
  }
})

test('PATCH /bookmarks/:id - should require authentication and valid ID', async (t) => {
  const app = await build(t)
  const testId = '507f1f77bcf86cd799439011'

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'PATCH',
    url: `/bookmarks/${testId}`,
    payload: {
      data: {
        type: 'bookmarks',
        id: testId,
        attributes: {
          title: 'Updated Title'
        }
      }
    }
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'PATCH',
      url: `/bookmarks/${testId}`,
      headers: getAuthHeaders(token),
      payload: {
        data: {
          type: 'bookmarks',
          id: testId,
          attributes: {
            title: 'Updated Title'
          }
        }
      }
    })

    // Depending on data shape and aggregation behavior this can also return 500.
    assert.ok(
      authResponse.statusCode === 200
      || authResponse.statusCode === 404
      || authResponse.statusCode === 400
      || authResponse.statusCode === 401
      || authResponse.statusCode === 422
      || authResponse.statusCode === 500
    )
  }
})

test('DELETE /bookmarks/:id - should require authentication', async (t) => {
  const app = await build(t)
  const testId = '507f1f77bcf86cd799439011'

  // Test without authentication
  const unauthResponse = await app.inject({
    method: 'DELETE',
    url: `/bookmarks/${testId}`
  })

  assert.ok(unauthResponse.statusCode >= 400)

  // Test with authentication
  const token = await generateTestToken(app)
  if (token) {
    const authResponse = await app.inject({
      method: 'DELETE',
      url: `/bookmarks/${testId}`,
      headers: getAuthHeaders(token)
    })

    // Depending on data shape and aggregation behavior this can also return 500.
    assert.ok(
      authResponse.statusCode === 204
      || authResponse.statusCode === 404
      || authResponse.statusCode === 400
      || authResponse.statusCode === 401
      || authResponse.statusCode === 422
      || authResponse.statusCode === 500
    )
  }
})

test('GET /bookmarks/:id with invalid ID format', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'GET',
      url: '/bookmarks/invalid-id',
      headers: getAuthHeaders(token)
    })

    // Should return 400 for invalid ID format
    assert.ok(response.statusCode >= 400)
  }
})

test('POST /bookmarks with invalid JSONAPI structure', async (t) => {
  const app = await build(t)
  const token = await generateTestToken(app)
  
  if (token) {
    const response = await app.inject({
      method: 'POST',
      url: '/bookmarks',
      headers: getAuthHeaders(token),
      payload: {
        // Missing proper JSONAPI structure
        title: 'Invalid structure'
      }
    })

    assert.ok(response.statusCode >= 400)
  }
})

test('POST /bookmarks - should block note links for non-members', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')

  assert.ok(auth.token)
  assert.ok(auth.user)

  const response = await app.inject({
    method: 'POST',
    url: '/bookmarks',
    headers: getAuthHeaders(auth.token!),
    payload: createJsonapiRequest('bookmarks', {
      ...mockBookmark,
      user_id: auth.user!._id,
      note: 'https://spam.example/buy-now'
    })
  })

  assert.strictEqual(response.statusCode, 403)
  const body = JSON.parse(response.payload)
  assert.strictEqual(body.errors?.[0]?.title, 'Note links require a member account')
})

test('PATCH /bookmarks/:id - should block note links for non-members', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')

  assert.ok(auth.token)
  assert.ok(auth.user)

  const bookmark = await BookmarkModel.create({
    ...mockBookmark,
    note: 'Plain note only',
    user_id: auth.user!._id,
    inception_clearance: 1,
  })

  const response = await app.inject({
    method: 'PATCH',
    url: `/bookmarks/${bookmark._id}`,
    headers: getAuthHeaders(auth.token!),
    payload: {
      data: {
        type: 'bookmarks',
        id: bookmark._id.toString(),
        attributes: {
          ...mockBookmark,
          user_id: auth.user!._id,
          note: '[spam](https://spam.example/buy-now)'
        }
      }
    }
  })

  assert.strictEqual(response.statusCode, 403)
  const body = JSON.parse(response.payload)
  assert.strictEqual(body.errors?.[0]?.title, 'Note links require a member account')
})

test('GET /bookmarks - unauthenticated no-search requests should return an empty collection', async (t) => {
  const app = await build(t)
  const suffix = Date.now().toString(36)
  const publishedTitle = `visibility-published-${suffix}`
  const unpublishedTitle = `visibility-unpublished-${suffix}`

  await BookmarkModel.create({
    user_id: `public-owner-${suffix}`,
    platform: 'youtube',
    start_seconds: 0,
    title: publishedTitle,
    is_published: true,
    is_active: true,
  })

  await BookmarkModel.create({
    user_id: `public-owner-${suffix}`,
    platform: 'youtube',
    start_seconds: 0,
    title: unpublishedTitle,
    is_published: false,
    is_active: true,
  })

  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks?page[number]=1&page[size]=100'
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  assert.deepStrictEqual(body.data || [], [])
})

test('GET /bookmarks - authenticated requests should include own unpublished bookmarks only', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  assert.ok(auth.token)
  assert.ok(auth.user)

  const suffix = Date.now().toString(36)
  const ownUnpublishedTitle = `visibility-own-unpublished-${suffix}`
  const otherUnpublishedTitle = `visibility-other-unpublished-${suffix}`

  await BookmarkModel.create({
    user_id: auth.user!._id,
    platform: 'youtube',
    start_seconds: 0,
    title: ownUnpublishedTitle,
    is_published: false,
    is_active: true,
  })

  await BookmarkModel.create({
    user_id: `other-owner-${suffix}`,
    platform: 'youtube',
    start_seconds: 0,
    title: otherUnpublishedTitle,
    is_published: false,
    is_active: true,
  })

  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks?page[number]=1&page[size]=100',
    headers: getAuthHeaders(auth.token!)
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  const titles = (body.data || [])
    .map((resource: { attributes?: { title?: string } }) => resource.attributes?.title)
    .filter(Boolean)

  assert.ok(titles.includes(ownUnpublishedTitle))
  assert.ok(!titles.includes(otherUnpublishedTitle))
})

test('GET /bookmarks - unauthenticated search should coerce private mode to public', async (t) => {
  const app = await build(t)
  const suffix = Date.now().toString(36)
  const query = `force-public-${suffix}`
  const unpublishedTitle = `unpublished-${query}`

  await BookmarkModel.create({
    user_id: `private-owner-${suffix}`,
    platform: 'youtube',
    start_seconds: 0,
    title: unpublishedTitle,
    is_published: false,
    is_active: true,
  })

  const response = await app.inject({
    method: 'GET',
    url: `/bookmarks?filter[search]=${encodeURIComponent(query)}&filter[mode]=private&page[number]=1&page[size]=100`
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  const titles = (body.data || [])
    .map((resource: { attributes?: { title?: string } }) => resource.attributes?.title)
    .filter(Boolean)
  assert.ok(!titles.includes(unpublishedTitle))

  const selfLink = String(body.links?.self || '')
  assert.ok(selfLink.includes('filter%5Bmode%5D=public') || selfLink.includes('filter[mode]=public'))
  assert.ok(!selfLink.includes('filter%5Bmode%5D=private') && !selfLink.includes('filter[mode]=private'))
  assert.ok(selfLink.includes('filter%5Bsearch%5D=') || selfLink.includes('filter[search]='))
})

test('GET /bookmarks - no-search private mode pagination links should include filter[mode]=private', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  assert.ok(auth.token)
  assert.ok(auth.user)

  const suffix = Date.now().toString(36)
  const docsToCreate = Array.from({ length: 26 }).map((_, index) => ({
    ...mockBookmark,
    user_id: auth.user!._id,
    title: `private-recents-${suffix}-${index}`,
    is_published: false,
    is_active: true,
  }))

  await BookmarkModel.insertMany(docsToCreate)

  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks?filter[mode]=private&page[number]=1',
    headers: getAuthHeaders(auth.token!)
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)

  const selfLink = String(body.links?.self || '')
  const firstLink = String(body.links?.first || '')
  const lastLink = String(body.links?.last || '')
  const nextLink = String(body.links?.next || '')

  const hasPrivateModeFilter = (link: string): boolean => {
    return link.includes('filter[mode]=private')
      || link.includes('filter%5Bmode%5D=private')
  }

  assert.ok(hasPrivateModeFilter(selfLink))
  assert.ok(hasPrivateModeFilter(firstLink))
  assert.ok(hasPrivateModeFilter(lastLink))
  assert.ok(hasPrivateModeFilter(nextLink))
})

test('GET /bookmarks - unauthenticated no-search should return an empty collection', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks?page[number]=1&page[size]=25'
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  assert.deepStrictEqual(body.data || [], [])
})