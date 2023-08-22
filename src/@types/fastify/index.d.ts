import { Session } from 'fastify'
import { IUser } from 'src/schema/users'

/**
 * @see https://github.com/TypeStrong/ts-node#missing-types
 */

declare module 'fastify' {
  interface Session {
    user?: IUser
    authenticated?: boolean
  }
}
