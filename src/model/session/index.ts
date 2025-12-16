import { model } from 'mongoose'
import sessionSchema, {
  ISession,
  ISessionDocument
} from '../../schema/session'
import { IUserDocument, TContextualUser } from '../../schema/user'
import { read_user_by_name } from '../user'
import { USER_CACHE } from '../../business.logic/cache'

export const SessionModel = model<ISession>('Session', sessionSchema)

interface ICreateSession {
  token: string
  user?: IUserDocument
  expiration_date?: number
  ip?: string
}

interface IGetSession {
  user?: IUserDocument
  ip?: string
  token?: string
}

/**
 * Save user session to the database.
 * 
 * **NOTE**: This function does not save the session to the database. It only creates
 * a session document.
 * @param session The session to save
 * @returns The session document
 */
export const create_session = async function ({
  user,
  token,
  expiration_date = 0,
  ip
}: ICreateSession): Promise<ISessionDocument> {
  if (user && token) {
    const dbSession = await SessionModel.create({
      user,
      token,
      expiration_date,
    })
    return dbSession
  }
  if (token && ip) {
    const dbSession = await SessionModel.create({
      token,
      expiration_date,
      ip
    })
    return dbSession
  }
  throw new Error('User or token is required')
}

/**
 * Find a session by its token.
 * @param token The token to search for
 * @returns The session document
 */
export const find_session_by_token = async function (
  token?: string
): Promise<ISessionDocument|null> {
  const sessionDoc = SessionModel.findOne({ token })
  return sessionDoc
}

/**
 * Retrieve the session from the database based on the token. If the session
 * is not found, then create a new session.
 * [TODO] Create session for anonymous users. Find a way to identify anonymous
 *        users. Maybe use the IP address?
 * @param user The user to create the session for
 * @param token The session token
 * @param ip The IP address of the user
 * @returns The session document
 * @deprecated obsolete.
 */
export const read_session = async function ({
  user,
  token,
  ip
}: IGetSession): Promise<ISessionDocument> {
  const sessionDoc = await find_session_by_token(token)
  if (sessionDoc) { return sessionDoc }
  if (user && token) {
    const sessionDoc = await create_session({ user, token })
    return sessionDoc
  }
  if (token && ip) {
    const sessionDoc = await create_session({ ip, token })
    return sessionDoc
  }
  throw new Error('Session not found')
}

interface IGetSessionUser {
  name?: string
  token?: string
}

/**
 * Get a *user* by name.
 * Use this function to retrieve a logged in user document.
 * @param name Username
 * @param token Session token
 * @returns User document
 */
export const read_user = async ({
  name,
  token
}: IGetSessionUser): Promise<IUserDocument | null> => {
  if (name) {
    const cUser = USER_CACHE.get(name)
    if (cUser) { return cUser as IUserDocument }
  }
  if (token) {
    const session = await find_session_by_token(token)
    if (session) {
      const sUser = session.user
      if (sUser) {
        USER_CACHE.set(sUser.name, sUser)
        return sUser
      }
    }
  }
  if (name) {
    const user = await read_user_by_name(name)
    if (user) {
      USER_CACHE.set(user.name, user)
      return user
    }
  }
  return null
}

/**
 * Get a ciphered user object.
 *
 * @param user 
 * @returns 
 */
export const get_contextual_user = function (
  user: IUserDocument
): TContextualUser {
  const { _id, name, jwt_version, role } = user
  return { _id: _id.toString(), name, jwt_version, role }
}

export const create_user_in_session = async function (
  session: ISessionDocument,
  user: IUserDocument
): Promise<ISessionDocument> {
  session.user = user
  const dbSession = await session.save()
  return dbSession
}

/**
 * Delete a session from the database.
 * @param token The token of the session to delete
 * @returns The session document
 */
export const delete_session = async function (
  token: string
): Promise<ISessionDocument|null> {
  const sessionDoc = await SessionModel.findOne({ token })
  if (sessionDoc) {
    await sessionDoc.deleteOne()
    return sessionDoc
  }
  return null
}