import type { TJsonapiRequest } from '@tuber/shared'
import type { TThemeMode } from '../../common.types'

export type TRole = 'owner' | 'developer' | 'administrator' | 'moderator'
                    | 'supporter' | 'member' | 'patron' | 'sponsor' | 'investor'
                    | 'donor' | 'free'

export const ROLE_CLEARANCE_LEVEL: Readonly<Record<TRole, number>> = {
  /** Have ownership and decision making power. ($3000000) */
  owner: 7,
  /** Have ownership privilege and make request for changes. ($300000) */
  investor: 7,
  /** Have ownership privilege. ($30000) */
  donor: 7,
  developer: 6,
  administrator: 5,
  /** Have administrator privilege ($3000). */
  sponsor: 5,
  moderator: 4,
  /** Have moderator privilege. ($300) */
  patron: 4,
  /**
   * A member account has the same privilege as a supporter account and in
   * addition, they can can publish bookmarks of unknown platforms. ($30)
   */
  member: 3,
  /**
   * Supporter accounts can publish bookmarks from all known platforms so 
   * others can search and see them. ($3)
   */
  supporter: 2,
  /** Free accounts can create bookmarks but cannot publish them. (FREE) */
  free: 1
}

/** List of all permissions as keys and values. */
const PERMISSIONS = {
  // GET USER -----------------------------------------------------------------

  /** Get a user account regardless of role (owner & dev). */
  user_get: 'user_get',
  /** Get a user account with the moderator role or lower. (admin) */
  user_get_mod: 'user_get_moderator',
  /** Get a user account with the free role. (moderator) */
  user_get_free: 'user_get_free',
  /** Get his or her own user account. */
  user_get_self: 'user_get_self',

  // POST USER ----------------------------------------------------------------

  /** Create a user with any role (owner & dev) */
  user_post: 'user_post',
  /** Create a user with the moderator role or lower. (admin) */
  user_post_mod: 'user_post_mod',
  /** Create an account with the free role. (moderator) */
  user_post_free: 'user_post_free',
  /** Create his or her own user account */
  user_post_self: 'user_post_self',

  // PATCH USER ---------------------------------------------------------------

  /** Edit a user account regardless of role (owner & dev). */
  user_patch: 'user_patch',
  /** Edit a user account with the moderator role or lower. (admin) */
  user_patch_mod: 'user_patch_moderator',
  /** Edit a user account with the free role. (moderator) */
  user_patch_free: 'user_patch_free',
  /** Edit his or her own user account. */
  user_patch_self: 'patch_user_self',

  // PUT USER -----------------------------------------------------------------

  /** Replace a user account regardless of role. (owner & dev) */
  // user_put: 'user_put',
  /** Replace a user with the moderator role or lower. (admin) */
  // user_put_mod: 'user_put_mod',
  /** Replace a user with the free role. (moderator) */
  // user_put_free: 'user_put_free',
  /** Replace his or her own user account. */
  // user_put_self: 'user_put_self',

  // DELETE USER --------------------------------------------------------------

  /** Delete a user regardless or role (owner & dev). */
  user_delete: 'delete_user',
  /** Delete a user with the moderator role or lower. (admin) */
  user_delete_mod: 'delete_user_mod',
  /** Delete a user with the free role. (moderator) */
  user_delete_free: 'delete_user_free',
  /** Delete his or her own user account. */
  user_delete_self: 'delete_user_self',

  // GET BOOKMARK -------------------------------------------------------------

  /** Get a bookmark regardless of creator's role. (moderator) */
  bookmark_get: 'bookmark_get',
  /** Get a published bookmark regardless of creator's role. (all roles) */
  bookmark_get_published: 'bookmark_get_published',
  /** Get an inactive bookmark. (owner & dev) */
  bookmark_get_inactive: 'bookmark_get_inactive',
  /** Get a disabled bookmark regardless of a user's role. (moderator) */
  bookmark_get_disabled: 'bookmark_get_disabled',
  /** Get a bookmark belonging to a user with the administrator role. */
  bookmark_get_admin: 'get_bookmark_admin',
  /** Get a bookmark belonging to a user with the moderator role. */
  bookmark_get_mod: 'bookmark_get_mod',
  /** Get a bookmark belonging to a user with the free role. */
  bookmark_get_free: 'bookmark_get_free',
  /** Get his or her own bookmark. */
  bookmark_get_self: 'get_bookmark_self',

  // POST BOOKMARK ------------------------------------------------------------

  /** Create a new bookmark for any platform. (Member) */
  bookmark_post: 'bookmark_post',

  // PATCH BOOKMARK

  /** Edit a bookmark regardless of the creator's role. (owner & dev) */
  bookmark_patch: 'bookmark_patch',
  /**
   * Edit a bookmark belonging to a user with the moderator role or lower (admin).
   */
  bookmark_patch_mod: 'bookmark_patch_mod',
  /**
   * Edit a bookmark belonging to a user with the free role.
   */
  bookmark_patch_free: 'bookmark_patch_free',

  // DELETE BOOKMARK

  /** Can delete a bookmark regardless of the creator's role. (owner & dev) */
  bookmark_delete: 'bookmark_delete',
  /** Delete a bookmark from a user with the administrator role or lower. */
  bookmark_delete_admin: 'bookmark_delete_admin',
  /** Delete a bookmark from a user with the moderator role or lower. */
  bookmark_delete_mod: 'bookmark_delete_mod',
  /** Delete a bookmark from a user with the free role. */
  bookmark_delete_free: 'bookmark_delete_free',
  /** Delete his or her own bookmark. */
  bookmark_delete_self: 'bookmark_delete_self',

  // PATCH BOOKMARK

  /** Can publish a bookmark regardless of the creator's role. */
  bookmark_patch_publish: 'bookmark_patch_publish',
  /** Publish his or her own bookmark. */
  bookmark_patch_publish_self: 'bookmark_patch_publish_self',
  /** Publish his or her own bookmark with a known platform. */
  bookmark_patch_publish_known_self: 'bookmark_patch_publish_known_self',
  /** Publish his or her own bookmark with an unknown platform. */
  bookmark_patch_publish_unknown_self: 'bookmark_patch_publish_unknown_self',
} as const

export type TPermission = keyof typeof PERMISSIONS

/** Required permission level and above. */
const PERMISSIONS_LEVEL: Readonly<{[key in keyof typeof PERMISSIONS]: number}> = {
  user_get: 6,
  user_get_mod: 5,
  user_get_free: 4,
  user_get_self: 1,
  user_post: 6,
  user_post_mod: 5,
  user_post_free: 4,
  user_post_self: 1,
  user_patch: 6,
  user_patch_mod: 5,
  user_patch_free: 4,
  user_patch_self: 1,
  user_delete: 6,
  user_delete_mod: 5,
  user_delete_free: 4,
  user_delete_self: 1,
  bookmark_get: 6,
  bookmark_get_published: 1,
  bookmark_get_inactive: 6,
  bookmark_get_disabled: 5,
  bookmark_get_admin: 6,
  bookmark_get_mod: 5,
  bookmark_get_free: 4,
  bookmark_get_self: 1,
  bookmark_post: 6,
  bookmark_patch: 6,
  bookmark_patch_mod: 5,
  bookmark_patch_free: 4,
  bookmark_delete: 6,
  bookmark_delete_admin: 6,
  bookmark_delete_mod: 5,
  bookmark_delete_free: 4,
  bookmark_delete_self: 1,
  bookmark_patch_publish: 6,
  bookmark_patch_publish_self: 3,
  bookmark_patch_publish_known_self: 2,
  bookmark_patch_publish_unknown_self: 3
}

export interface IRequestAuth {
  Body: TJsonapiRequest<{
    credentials?: {
      username?: string
      password?: string
      options?: string[]
    }
    route?: string
    mode?: TThemeMode
    cookie?: string
  }>
}

/** Use to enforce permission based on user role. */
export const has_permission = (permission: TPermission, role: TRole) => {
  return PERMISSIONS_LEVEL[permission] <= ROLE_CLEARANCE_LEVEL[role]
}
