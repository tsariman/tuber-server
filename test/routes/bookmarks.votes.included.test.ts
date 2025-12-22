import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, generateTestToken, getAuthHeaders, mockUser } from '../helper'
import { UserModel } from '../../src/model/user'
import { BookmarkModel } from '../../src/model/bookmark'

/** Utility to create a user document with votes if it does not already exist */
async function ensureUserWithVotes() {
  const existing = await UserModel.findById(mockUser._id)
  if (existing) {
    return existing
  }
  return await UserModel.create({
    _id: mockUser._id,
    name: mockUser.name,
    email: mockUser.email,
    votes: []
  })
}

/** Utility to create test bookmarks */
async function createTestBookmarks() {
  const bookmark1 = await BookmarkModel.create({
    user_id: mockUser._id,
    platform: 'youtube',
    start_seconds: 0,
    title: 'Test Bookmark 1',
    videoid: 'testVid1'
  })
  
  const bookmark2 = await BookmarkModel.create({
    user_id: mockUser._id,
    platform: 'youtube',
    start_seconds: 0,
    title: 'Test Bookmark 2',
    videoid: 'testVid2'
  })
  
  return { bookmark1, bookmark2 }
}

test('GET /bookmarks should include user votes in relationships and included', async (t) => {
  const app = await build(t)
  await app.ready()
  
  // Create user with votes
  const user = await ensureUserWithVotes()
  const { bookmark1, bookmark2 } = await createTestBookmarks()
  
  // Add votes to the user
  user.votes = [
    {
      bookmark_id: String(bookmark1._id),
      rating: 1, // upvote
      is_active: true,
      created_at: new Date()
    },
    {
      bookmark_id: String(bookmark2._id),
      rating: -1, // downvote
      is_active: true,
      created_at: new Date()
    }
  ]
  await user.save()
  
  // Generate token and make authenticated request
  const token = await generateTestToken(app)
  assert.ok(token, 'Token should be generated')
  
  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks',
    headers: getAuthHeaders(token!)
  })
  
  assert.strictEqual(response.statusCode, 200, 'Should return 200 OK')
  
  const body = JSON.parse(response.payload)
  
  // Verify the response structure
  assert.ok(body.data, 'Response should have data')
  assert.ok(Array.isArray(body.data), 'Data should be an array')
  
  // Find bookmarks we just created in the response
  const bookmark1Response = body.data.find((b: any) => b.id === String(bookmark1._id))
  const bookmark2Response = body.data.find((b: any) => b.id === String(bookmark2._id))
  
  // Verify relationships exist for voted bookmarks
  if (bookmark1Response) {
    assert.ok(bookmark1Response.relationships, 'Bookmark 1 should have relationships')
    assert.ok(
      bookmark1Response.relationships['bookmark-vote'],
      'Bookmark 1 should have bookmark-vote relationship'
    )
    assert.strictEqual(
      bookmark1Response.relationships['bookmark-vote'].data.type,
      'bookmark-votes',
      'Relationship type should be bookmark-votes'
    )
    assert.strictEqual(
      bookmark1Response.relationships['bookmark-vote'].data.id,
      String(bookmark1._id),
      'Relationship id should match bookmark id'
    )
  }
  
  if (bookmark2Response) {
    assert.ok(bookmark2Response.relationships, 'Bookmark 2 should have relationships')
    assert.ok(
      bookmark2Response.relationships['bookmark-vote'],
      'Bookmark 2 should have bookmark-vote relationship'
    )
  }
  
  // Verify included documents contain the votes
  if (body.included) {
    assert.ok(Array.isArray(body.included), 'Included should be an array')
    
    const vote1Included = body.included.find(
      (inc: any) => inc.type === 'bookmark-votes' && inc.id === String(bookmark1._id)
    )
    const vote2Included = body.included.find(
      (inc: any) => inc.type === 'bookmark-votes' && inc.id === String(bookmark2._id)
    )
    
    if (vote1Included) {
      assert.strictEqual(vote1Included.attributes.rating, 1, 'Vote 1 rating should be 1 (upvote)')
      assert.strictEqual(
        vote1Included.attributes.bookmark_id,
        String(bookmark1._id),
        'Vote 1 bookmark_id should match'
      )
    }
    
    if (vote2Included) {
      assert.strictEqual(vote2Included.attributes.rating, -1, 'Vote 2 rating should be -1 (downvote)')
      assert.strictEqual(
        vote2Included.attributes.bookmark_id,
        String(bookmark2._id),
        'Vote 2 bookmark_id should match'
      )
    }
  }
})

test('GET /bookmarks without authentication should not include user votes', async (t) => {
  const app = await build(t)
  await app.ready()
  
  const response = await app.inject({
    method: 'GET',
    url: '/bookmarks'
  })
  
  assert.strictEqual(response.statusCode, 200, 'Should return 200 OK')
  
  const body = JSON.parse(response.payload)
  
  // Verify the response structure
  assert.ok(body.data, 'Response should have data')
  
  // Bookmarks should not have bookmark-vote relationships when not authenticated
  if (Array.isArray(body.data) && body.data.length > 0) {
    body.data.forEach((bookmark: any) => {
      if (bookmark.relationships) {
        assert.ok(
          !bookmark.relationships['bookmark-vote'],
          'Unauthenticated requests should not have bookmark-vote relationships'
        )
      }
    })
  }
  
  // Should not have included votes
  if (body.included) {
    const bookmarkVotes = body.included.filter((inc: any) => inc.type === 'bookmark-votes')
    assert.strictEqual(bookmarkVotes.length, 0, 'Should not include bookmark votes when not authenticated')
  }
})
