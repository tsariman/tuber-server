import { UserModel } from '../model/user'
import { BookmarkVoteModel } from '../model/bookmark.vote'
import mongoose from 'mongoose'
import Config from '../config'

/**
 * Migration script to backfill legacy user.votes arrays into the new bookmarkVotes collection.
 * Run once after deploying the new collection.
 *
 * Process:
 * 1. Connect to MongoDB.
 * 2. Stream users with non-empty votes array.
 * 3. Insert missing bookmark vote documents (idempotent: skips existing).
 */
async function run() {
  const MONGODB_URI = Config.DB_REMOTE ? Config.DB_URI_REMOTE : Config.DB_URI_LOCAL
  await mongoose.connect(MONGODB_URI)
  const cursor = UserModel.find({ 'votes.0': { $exists: true } }, { votes: 1 }).cursor()
  let migrated = 0
  let skipped = 0
  for await (const user of cursor) {
    const uid = String(user._id)
    for (const v of user.votes || []) {
      const exists = await BookmarkVoteModel.exists({ user_id: uid, bookmark_id: v.bookmark_id })
      if (exists) { skipped++; continue }
      await BookmarkVoteModel.create({ user_id: uid, bookmark_id: v.bookmark_id, rating: v.rating })
      migrated++
    }
  }
  console.log(`Bookmark vote migration complete. Migrated=${migrated} Skipped=${skipped}`)
  await mongoose.disconnect()
}

run().catch(e => { console.error('Migration failed', e); process.exit(1) })
