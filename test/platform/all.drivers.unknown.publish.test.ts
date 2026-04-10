import { test } from 'node:test'
import * as assert from 'node:assert'
import fix_missing_bookmark_data from '../../src/platform/all.drivers'
import { IBookmark } from '../../src/schema/bookmark'
import { TContextualUser } from '../../src/schema/user'

function makeUser(role: TContextualUser['role']): TContextualUser {
  return {
    _id: '507f1f77bcf86cd799439011' as unknown as TContextualUser['_id'],
    name: `user-${role}`,
    jwt_version: 0,
    role,
  }
}

function makeUnknownBookmark(isPublished: boolean): IBookmark {
  return {
    platform: 'unknown',
    url: 'https://example.com/watch?v=abc123',
    title: 'Unknown video',
    start_seconds: 0,
    thumbnail_url: 'https://example.com/thumb.jpg',
    is_published: isPublished,
  }
}

test('unknown bookmark publish is stripped for free users', async () => {
  const result = await fix_missing_bookmark_data(
    makeUnknownBookmark(true),
    makeUser('free')
  )

  assert.ok(result)
  assert.strictEqual(result?.is_published, undefined)
})

test('unknown bookmark publish is preserved for moderator users', async () => {
  const result = await fix_missing_bookmark_data(
    makeUnknownBookmark(true),
    makeUser('moderator')
  )

  assert.ok(result)
  assert.strictEqual(result?.is_published, true)
})
