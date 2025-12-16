import mongoose from 'mongoose'
import Config from '../config'

/**
 * Migration helper to ensure the `users` collection uses case-insensitive collation
 * and has unique indexes on `name` and `email` that respect collation.
 */
async function ensureUsersCollationAndIndexes() {
  const uri = Config.DB_REMOTE ? Config.DB_URI_REMOTE : Config.DB_URI_LOCAL
  console.log('[MIGRATION] Connecting to database...')
  await mongoose.connect(uri)
  const db = mongoose.connection.db!

  const collectionName = 'users'

  // Ensure collection exists
  const collections = await db.listCollections({ name: collectionName }).toArray()
  if (collections.length === 0) {
    console.log(`[MIGRATION] Creating collection ${collectionName} with collation`) 
    await db.createCollection(collectionName, { collation: { locale: 'en', strength: 2 } })
  } else {
    console.log(`[MIGRATION] Collection ${collectionName} exists`) 
  }

  const users = db.collection(collectionName)

  // Drop conflicting indexes if present
  const indexes = await users.indexes()
  for (const idx of indexes) {
    if (idx.key && (idx.key['name'] || idx.key['email'])) {
      console.log(`[MIGRATION] Dropping index ${idx.name}`)
      if (idx.name) {
        await users.dropIndex(idx.name).catch(() => {})
      }
    }
  }

  // Recreate unique indexes with collation
  console.log('[MIGRATION] Creating unique index on name (case-insensitive)')
  await users.createIndex({ name: 1 }, { unique: true, name: 'uniq_name_ci', collation: { locale: 'en', strength: 2 } })

  console.log('[MIGRATION] Creating unique index on email (case-insensitive)')
  await users.createIndex({ email: 1 }, { unique: true, name: 'uniq_email_ci', collation: { locale: 'en', strength: 2 } })

  await mongoose.disconnect()
  console.log('[MIGRATION] Done.')
}

ensureUsersCollationAndIndexes().catch(err => {
  console.error('[MIGRATION] Failed:', err)
  process.exitCode = 1
})
