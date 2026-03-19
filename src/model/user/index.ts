import {
  PaginateModel,
  PaginateResult,
  model
} from 'mongoose'
import { IMPV2Doc } from '../../common.types'
import { get_hashed_password } from '../../business.logic/security'
import Config from '../../config'
import { USER_CACHE } from '../../business.logic/cache'
import userSchema, {
  IUser,
  IUserDocument,
  TUsersFastifyRequest
} from '../../schema/user'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '@tuber/shared'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    jwt_version: 0,
    password: 0,
  },

  // TODO Add custom pagination options here
}

/** User model for pagination */
export const UserPaginationModel = model<
  IUserDocument,
  PaginateModel<IUserDocument>
>('users', userSchema, 'users')

/** User model with no pagination */
export const UserModel = model<IUserDocument>('users', userSchema)

/** Exclude fields from the user document. @deprecated */
export const exclude_user_fields_IMPV2Doc = (user: IMPV2Doc<IUserDocument>) => {
  const {
    _doc: {
      jwt_version,
      is_active,
      password,
      restrictions,
      rules,
      __v,
      ...userDoc
    }
  } = user

  return userDoc
}

/** Excludes sensitive fields from the user document. */
export const transform_user_doc = (user: IUserDocument) => {
  const plainUser = user.toObject()
  const {
    jwt_version,
    is_active,
    password,
    restrictions,
    rules,
    email_verification_code,
    email_verification_code_expires,
    _id,
    __v,
    ...userDoc
  } = plainUser
  return userDoc
}

export const read_user_by_id = async (
  id: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserModel.findOne({ 
    _id: id, 
    is_active: { $ne: false } 
  }).select('-password -restrictions -rules')
  return userDoc
}

export const read_user_by_name = async (
  name: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserModel.findOne({ 
    name: name.trim().toLowerCase(),
    is_active: { $ne: false }
  }).select('-password -restrictions -rules')
  return userDoc
}

/** Create a new user */
export const create_user = async (userInfo: IUser): Promise<IUserDocument> => {
  const name = typeof userInfo.name === 'string' ? userInfo.name.trim() : userInfo.name
  const email = typeof userInfo.email === 'string' ? userInfo.email.trim().toLowerCase() : userInfo.email

  const createPayload: Partial<IUser> = {
    ...userInfo,
    name,
    email,
  }

  if (userInfo.password) {
    createPayload.password = await get_hashed_password(userInfo.password)
  }

  const um = await UserPaginationModel.create(createPayload as IUser)
  const user = await um.save()
  return user
}

/** Get all users */
export const read_user_collection = async (
  req: TUsersFastifyRequest
): Promise<PaginateResult<IUserDocument>> => {
  const page = Number(req.query.page?.number ?? 1)
  const limit = Number(req.query.page?.size ?? Config.PAGINATION_USER_LIMIT)
  const result = await UserPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
  return result
}

/** Find a user by email using mongoose */
export const read_user_by_email = async (
  email: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserModel.findOne({ 
    email: email.trim().toLowerCase(),
    is_active: { $ne: false }
  }).select('-password -jwt_version -restrictions -rules')
  return userDoc
}

/** Return total number of documents in the users collection */
export const read_user_collection_count = async (): Promise<number> => {
  const count = await UserModel.countDocuments({ is_active: { $ne: false } })
  return count
}

export interface IPatreonSupporterSyncInput {
  patreonUserId?: string
  membershipId?: string
  email?: string
  event?: string
  isActive: boolean
}

export interface IPatreonSupporterSyncResult {
  status: 'updated' | 'noop' | 'not_found'
  reason?: string
  userId?: string
  userName?: string
  roleBefore?: IUserDocument['role']
  roleAfter?: IUserDocument['role']
}

/**
 * Synchronize user role based on Patreon subscription status.
 *
 * - Active Patreon subscription upgrades `free -> supporter`.
 * - Inactive/cancelled subscription downgrades `supporter -> free` only when
 *   the supporter role came from Patreon automation.
 */
export const sync_user_supporter_role_from_patreon = async (
  input: IPatreonSupporterSyncInput
): Promise<IPatreonSupporterSyncResult> => {
  const patreonUserId = input.patreonUserId?.trim()
  const email = input.email?.trim().toLowerCase()
  const membershipId = input.membershipId?.trim()

  if (!patreonUserId && !email) {
    return {
      status: 'not_found',
      reason: 'missing_identity',
    }
  }

  const identityFilter = [] as Array<Record<string, string>>
  if (patreonUserId) {
    identityFilter.push({ patreon_user_id: patreonUserId })
  }
  if (email) {
    identityFilter.push({ email })
  }

  const user = await UserModel.findOne({
    is_active: { $ne: false },
    $or: identityFilter,
  })

  if (!user) {
    return {
      status: 'not_found',
      reason: 'user_not_found',
    }
  }

  const roleBefore = user.role
  let changed = false

  if (patreonUserId && user.patreon_user_id !== patreonUserId) {
    user.patreon_user_id = patreonUserId
    changed = true
  }

  if (membershipId && user.patreon_membership_id !== membershipId) {
    user.patreon_membership_id = membershipId
    changed = true
  }

  const nextSubscriptionStatus = input.isActive ? 'active' : 'inactive'
  if (user.patreon_subscription_status !== nextSubscriptionStatus) {
    user.patreon_subscription_status = nextSubscriptionStatus
    changed = true
  }

  if (input.event && user.patreon_last_event !== input.event) {
    user.patreon_last_event = input.event
    changed = true
  }

  if (input.isActive && user.role === 'free') {
    user.role = 'supporter'
    user.supporter_source = 'patreon'
    user.jwt_version = (user.jwt_version ?? 0) + 1
    changed = true
  }

  if (!input.isActive && user.role === 'supporter' && user.supporter_source === 'patreon') {
    user.role = 'free'
    user.supporter_source = undefined
    user.jwt_version = (user.jwt_version ?? 0) + 1
    changed = true
  }

  if (!changed) {
    return {
      status: 'noop',
      reason: 'no_changes',
      userId: user._id.toString(),
      userName: user.name,
      roleBefore,
      roleAfter: user.role,
    }
  }

  await user.save()
  USER_CACHE.del(user.name)

  return {
    status: 'updated',
    userId: user._id.toString(),
    userName: user.name,
    roleBefore,
    roleAfter: user.role,
  }
}