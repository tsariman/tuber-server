// This file contains code that we reuse between our tests.
import * as path from 'node:path'
import * as test from 'node:test'
import { UserModel } from '../src/model/user'
const helper = require('fastify-cli/helper.js')

export type TestContext = {
  after: typeof test.after
}

const AppPath = path.join(__dirname, '..', 'src', 'app.ts')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    skipOverride: true // Register our application with fastify-plugin
  }
}

// Automatically build and tear down our instance
async function build (t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath]

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, config())

  // Tear down our app after we are done
  // eslint-disable-next-line no-void
  t.after(() => void app.close())

  return app
}

// Mock user data for testing
export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'testuser',
  email: 'test@example.com',
  password: '$2b$10$YourHashedPasswordHere', // bcrypt hash for 'testpass123'
  is_active: true,
  created_at: new Date(),
  modified_at: new Date()
}

export const mockCipheredUser = {
  _id: mockUser._id,
  name: mockUser.name,
  email: mockUser.email
}

// Helper to generate JWT token for authenticated requests
export async function generateTestToken(app: any, user = mockCipheredUser) {
  try {
    // Ensure jwt_version is present in payload by fetching current user
    const dbUser = await UserModel.findOne({ name: user.name })
    const payload = dbUser ? {
      _id: dbUser._id.toString(),
      name: dbUser.name,
      jwt_version: dbUser.jwt_version ?? 0,
      role: dbUser.role,
    } : user
    return await app.jwt.sign(payload, { expiresIn: '1h' })
  } catch (error) {
    console.error('Failed to generate test token:', error)
    return null
  }
}

// Helper to create authenticated request headers
export function getAuthHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Sample JSONAPI request structure for testing
export function createJsonapiRequest<T>(type: string, attributes: T) {
  return {
    data: {
      type,
      attributes
    }
  }
}

// Sample bookmark data for testing
export const mockBookmark = {
  title: 'Test Bookmark',
  platform: 'youtube',
  videoid: 'dQw4w9WgXcQ',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  start_seconds: 0,
  end_seconds: 212,
  note: 'Test note for bookmark',
  user_id: mockUser._id,
  is_private: false,
  is_active: true
}

// Sample user data for testing
export const mockUserData = {
  name: 'newuser',
  email: 'newuser@example.com',
  password: 'newpass123'
}

export {
  config,
  build
}
