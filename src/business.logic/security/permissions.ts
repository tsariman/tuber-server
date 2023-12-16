import { TThemeMode } from '../../common.types'

export type TRole = 'owner' | 'developer' | 'administrator' | 'moderator' | 'user'

export const ROLE_CLEARANCE_LEVEL: Record<TRole, number> = {
  owner: 7,
  developer: 6,
  administrator: 5,
  moderator: 4,
  user: 1
}

export const PERMISSIONS = {
  GET_USERS_ALL: 'get_users_all',
  GET_USERS_DEVELOPER: 'get_users_developer',
  GET_USERS_ADMINISTRATOR: 'get_users_administrator',
  GET_USERS_MODERATOR: 'get_users_moderator',
  GET_USERS_USER: 'get_users_user',
  GET_USERS_SELF: 'get_users_self',
  POST_USERS_ALL: 'post_users_all',
  POST_USERS_DEVELOPER: 'post_users_developer',
  POST_USERS_ADMINISTRATOR: 'post_users_administrator',
  POST_USERS_MODERATOR: 'post_users_moderator',
  POST_USERS_USER: 'post_users_user',
  POST_USERS_SELF: 'post_users_self',
  PUT_USERS_ALL: 'put_users_all',
  PUT_USERS_DEVELOPER: 'put_users_developer',
  PUT_USERS_ADMINISTRATOR: 'put_users_administrator',
  PUT_USERS_MODERATOR: 'put_users_moderator',
  PUT_USERS_USER: 'put_users_user',
  PUT_USERS_SELF: 'put_users_self',
  DELETE_USERS_ALL: 'delete_users_all',
  DELETE_USERS_DEVELOPER: 'delete_users_developer',
  DELETE_USERS_ADMINISTRATOR: 'delete_users_administrator',
  DELETE_USERS_MODERATOR: 'delete_users_moderator',
  DELETE_USERS_USER: 'delete_users_user',
  DELETE_USERS_SELF: 'delete_users_self',
}

export type TPermission = keyof typeof PERMISSIONS

export const PERMISSIONS_LEVEL: {[key in TPermission]: number} = {
  GET_USERS_ALL: 4,
  GET_USERS_DEVELOPER: 7,
  GET_USERS_ADMINISTRATOR: 6,
  GET_USERS_MODERATOR: 5,
  GET_USERS_USER: 4,
  GET_USERS_SELF: 1,
  POST_USERS_ALL: 7,
  POST_USERS_DEVELOPER: 7,
  POST_USERS_ADMINISTRATOR: 6,
  POST_USERS_MODERATOR: 5,
  POST_USERS_USER: 4,
  POST_USERS_SELF: 1,
  PUT_USERS_ALL: 7,
  PUT_USERS_DEVELOPER: 7,
  PUT_USERS_ADMINISTRATOR: 6,
  PUT_USERS_MODERATOR: 5,
  PUT_USERS_USER: 4,
  PUT_USERS_SELF: 1,
  DELETE_USERS_ALL: 7,
  DELETE_USERS_DEVELOPER: 7,
  DELETE_USERS_ADMINISTRATOR: 6,
  DELETE_USERS_MODERATOR: 5,
  DELETE_USERS_USER: 4,
  DELETE_USERS_SELF: 1,
}

export interface ISignInCredentials {
  Body: {
    credentials?: {
      username?: string
      password?: string
    }
    route?: string
    mode?: TThemeMode
    cookie?: string
  }
}

export function is_sign_in_credentials (obj: any): obj is ISignInCredentials {
  return obj.username && obj.password
}

export const has_permission = (permission: TPermission, role: TRole) => {
  return PERMISSIONS_LEVEL[permission] <= ROLE_CLEARANCE_LEVEL[role]
}