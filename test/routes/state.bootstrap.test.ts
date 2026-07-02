import { test } from 'node:test'
import * as assert from 'node:assert'
import { EP_BOOKMARKS } from '@tuber/shared'
import { build, generateTestAuthForRole, getAuthHeaders } from '../helper'
import { get_bootstrap_key } from '../../src/business.logic/security'
import { BookmarkModel } from '../../src/model/bookmark'

test('POST /state bootstrap - unauthenticated should always use public search mode', async (t) => {
  const app = await build(t)
  const bootstrapUrl = `/state/${get_bootstrap_key()}?filter[search_mode]=private&filter[search]=hello`

  const response = await app.inject({
    method: 'POST',
    url: bootstrapUrl
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)

  const researchPageKey = body?.state?.staticRegistry?.['40']
  assert.ok(typeof researchPageKey === 'string' && researchPageKey.length > 0)

  const pageData = body?.state?.pagesData?.[researchPageKey]
  assert.strictEqual(pageData?.searchMode, 'public')
  assert.strictEqual(pageData?.icon, 'public_outline')
  assert.strictEqual(pageData?.placeholder, 'Search public bookmarks…')
})

test('POST /state bootstrap - resolves and returns the page containing the playing bookmark key', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  assert.ok(auth.token)
  assert.ok(auth.user?._id)

  const baseTime = Date.now() - 60000
  const docs = await BookmarkModel.insertMany(
    Array.from({ length: 30 }, (_, i) => ({
      user_id: String(auth.user!._id),
      platform: 'youtube',
      start_seconds: 0,
      title: `Bootstrap precedence bookmark ${i + 1}`,
      videoid: `bootstrap-precedence-${i + 1}`,
      created_at: new Date(baseTime + (i * 1000)),
      modified_at: new Date(baseTime + (i * 1000)),
      is_published: true,
      is_active: true,
    }))
  )

  // Oldest bookmarks fall on page 2 for private no-search fallback (25/page).
  const expectedPageTwoBookmarkId = String(docs[0]._id)
  // Send stale page metadata and a conflicting query page to confirm server resolves actual page.
  const bootstrapUrl = `/state/${get_bootstrap_key()}?filter[search_mode]=private&page[number]=1&filter[playing_bookmark_key]=${encodeURIComponent(expectedPageTwoBookmarkId)}&filter[playing_bookmark_page]=1`

  const response = await app.inject({
    method: 'POST',
    url: bootstrapUrl,
    headers: getAuthHeaders(auth.token!),
    payload: {},
  })

  assert.strictEqual(response.statusCode, 200, response.payload)
  const body = JSON.parse(response.payload)
  const returnedIds = (body?.data || []).map((resource: { id?: string }) => resource.id)

  assert.ok(returnedIds.includes(expectedPageTwoBookmarkId))
  assert.strictEqual(
    body?.state?.pagesData?.[EP_BOOKMARKS]?.bookmarkToPlay?.id,
    expectedPageTwoBookmarkId
  )
  assert.strictEqual(body?.state?.pagesData?.[EP_BOOKMARKS]?.playingBookmarkPage, 2)
  assert.strictEqual(typeof body?.links?.self, 'string')
  assert.ok(String(body?.links?.self).includes('page%5Bnumber%5D=2'))
})

test('POST /state bootstrap - ignores invalid playing page and still resolves containing page', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  assert.ok(auth.token)
  assert.ok(auth.user?._id)

  const baseTime = Date.now() - 120000
  const docs = await BookmarkModel.insertMany(
    Array.from({ length: 30 }, (_, i) => ({
      user_id: String(auth.user!._id),
      platform: 'youtube',
      start_seconds: 0,
      title: `Bootstrap invalid-page bookmark ${i + 1}`,
      videoid: `bootstrap-invalid-page-${i + 1}`,
      created_at: new Date(baseTime + (i * 1000)),
      modified_at: new Date(baseTime + (i * 1000)),
      is_published: true,
      is_active: true,
    }))
  )

  const pageTwoBookmarkId = String(docs[0]._id)
  const bootstrapUrl = `/state/${get_bootstrap_key()}?filter[search_mode]=private&page[number]=1&filter[playing_bookmark_key]=${encodeURIComponent(pageTwoBookmarkId)}&filter[playing_bookmark_page]=0`

  const response = await app.inject({
    method: 'POST',
    url: bootstrapUrl,
    headers: getAuthHeaders(auth.token!),
    payload: {},
  })

  assert.strictEqual(response.statusCode, 200, response.payload)
  const body = JSON.parse(response.payload)
  const returnedIds = (body?.data || []).map((resource: { id?: string }) => resource.id)

  assert.ok(returnedIds.includes(pageTwoBookmarkId))
  assert.strictEqual(
    body?.state?.pagesData?.[EP_BOOKMARKS]?.bookmarkToPlay?.id,
    pageTwoBookmarkId
  )
  assert.strictEqual(body?.state?.pagesData?.[EP_BOOKMARKS]?.playingBookmarkPage, 2)
})

test('POST /state bootstrap - resolves to actual page even when requested page differs', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  assert.ok(auth.token)
  assert.ok(auth.user?._id)

  const baseTime = Date.now() - 180000
  const docs = await BookmarkModel.insertMany(
    Array.from({ length: 40 }, (_, i) => ({
      user_id: String(auth.user!._id),
      platform: 'youtube',
      start_seconds: 0,
      title: `Bootstrap stale-key bookmark ${i + 1}`,
      videoid: `bootstrap-stale-key-${i + 1}`,
      created_at: new Date(baseTime + (i * 1000)),
      modified_at: new Date(baseTime + (i * 1000)),
      is_published: true,
      is_active: true,
    }))
  )

  // Newest bookmarks (last in array, highest created_at) are on page 1 for private no-search fallback.
  // With 40 bookmarks at 25/page: docs[39-15] on page 1, docs[14-0] on page 2.
  const stalePage1BookmarkId = String(docs[39]._id) // Newest, definitely on page 1
  // Request page 2 with a key from page 1
  const bootstrapUrl = `/state/${get_bootstrap_key()}?filter[search_mode]=private&page[number]=1&filter[playing_bookmark_key]=${encodeURIComponent(stalePage1BookmarkId)}&filter[playing_bookmark_page]=2`

  const response = await app.inject({
    method: 'POST',
    url: bootstrapUrl,
    headers: getAuthHeaders(auth.token!),
    payload: {},
  })

  assert.strictEqual(response.statusCode, 200, response.payload)
  const body = JSON.parse(response.payload)
  const returnedIds = (body?.data || []).map((resource: { id?: string }) => resource.id)

  // The endpoint should return the page containing the key (page 1), not requested page 2.
  assert.ok(returnedIds.includes(stalePage1BookmarkId), 'Returned page should include the playing bookmark')
  assert.strictEqual(body?.state?.pagesData?.[EP_BOOKMARKS]?.playingBookmarkPage, 1)
  assert.strictEqual(
    body?.state?.pagesData?.[EP_BOOKMARKS]?.bookmarkToPlay?.id,
    stalePage1BookmarkId
  )
})

test('POST /state bootstrap - missing playing bookmark key in result set falls back to first page', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  assert.ok(auth.token)
  assert.ok(auth.user?._id)

  const baseTime = Date.now() - 210000
  const docs = await BookmarkModel.insertMany(
    Array.from({ length: 30 }, (_, i) => ({
      user_id: String(auth.user!._id),
      platform: 'youtube',
      start_seconds: 0,
      title: `Bootstrap fallback bookmark ${i + 1}`,
      videoid: `bootstrap-fallback-${i + 1}`,
      created_at: new Date(baseTime + (i * 1000)),
      modified_at: new Date(baseTime + (i * 1000)),
      is_published: true,
      is_active: true,
    }))
  )

  const newestBookmarkId = String(docs[29]._id)
  const missingBookmarkId = 'ffffffffffffffffffffffff'
  const bootstrapUrl = `/state/${get_bootstrap_key()}?filter[search_mode]=private&page[number]=2&filter[playing_bookmark_key]=${encodeURIComponent(missingBookmarkId)}&filter[playing_bookmark_page]=9`

  const response = await app.inject({
    method: 'POST',
    url: bootstrapUrl,
    headers: getAuthHeaders(auth.token!),
    payload: {},
  })

  assert.strictEqual(response.statusCode, 200, response.payload)
  const body = JSON.parse(response.payload)
  const returnedIds = (body?.data || []).map((resource: { id?: string }) => resource.id)

  assert.ok(returnedIds.includes(newestBookmarkId), 'Fallback should return first page results')
  assert.strictEqual(body?.state?.pagesData?.[EP_BOOKMARKS]?.bookmarkToPlay, undefined)
  assert.ok(String(body?.links?.self).includes('page%5Bnumber%5D=1'))
})