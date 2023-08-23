import { IUser } from 'src/schema/users'

/**
 * @see https://github.com/TypeStrong/ts-node#missing-types
 */

declare module '@fastify/secure-session' {
  interface SessionData {
    user?: IUser
    authenticated?: boolean
  }
}
