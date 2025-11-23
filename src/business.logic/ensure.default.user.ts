import { info, ler, task, task_end } from '../utility/logging'
import Config from '../config'
import { create_user, read_user_collection_count } from '../model/user'
import { IUser } from '../schema/user'

/**
 * Default user credentials that will be created if no users exist
 */
const DEFAULT_USER: IUser = {
  name: 'admin',
  email: 'admin@tuberesearcher.local',
  password: 'admin123',
  role: 'administrator',
  firstname: 'System',
  lastname: 'Administrator'
}

/**
 * Ensures at least one user exists in the database.
 * Creates a default admin user if the database is empty.
 * 
 * This can be called during authentication attempts or API requests
 * as a fallback mechanism.
 * 
 * @returns Promise<boolean> - true if default user was created, false if users already exist
 */
export async function ensureDefaultUserExists(): Promise<boolean> {
  try {
    // Only create default user in debug mode
    if (!Config.DEBUG) {
      console.log('App not in debug mode. Skipping default user creation.')
      return false
    }

    const userCount = await read_user_collection_count()
    
    if (userCount === 0) {
      task('No users found in database. Creating default admin user... ')

      await create_user(DEFAULT_USER)

      task_end('Success!\n')
      info('Username: admin')
      info('Password: admin123 (Please change this immediately!)')
      info('Role: administrator')

      return true
    }
    
    return false
  } catch (error) {
    ler('Failed!', error)
    throw error
  }
}

/**
 * Alternative default user configurations for different scenarios
 */
export const DEFAULT_USER_TEMPLATES = {
  admin: {
    name: 'admin',
    email: 'admin@tuberesearcher.local',
    password: 'admin123',
    role: 'administrator' as const,
    firstname: 'System',
    lastname: 'Administrator'
  },
  
  superuser: {
    name: 'superuser',
    email: 'super@tuberesearcher.local',
    password: 'super123',
    role: 'owner' as const,
    firstname: 'Super',
    lastname: 'User'
  },
  
  demo: {
    name: 'demo',
    email: 'demo@tuberesearcher.local',
    password: 'demo123',
    role: 'free' as const,
    firstname: 'Demo',
    lastname: 'User'
  }
}

/**
 * Creates a default user with custom template
 * 
 * @param template - User template to use
 * @returns Promise<IUserDocument> - Created user document
 */
export async function createDefaultUser(template: keyof typeof DEFAULT_USER_TEMPLATES = 'admin') {
  // Only create default user in debug mode
  if (!Config.DEBUG) {
    throw new Error('Default user creation is only allowed in debug mode')
  }

  const userTemplate = DEFAULT_USER_TEMPLATES[template]
  
  if (!userTemplate) {
    throw new Error(`Unknown user template: ${template}`)
  }
  
  const user = await create_user(userTemplate)
  
  info(`Default ${template} user created:`)
  info(`Username: ${userTemplate.name}`)
  info(`Password: ${userTemplate.password}`)
  info(`Role: ${userTemplate.role}`)
  
  return user
}
