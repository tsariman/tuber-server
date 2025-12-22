import { TRole } from '@tuber/shared'
import type { IResource, IResourceSensitive } from '../../common.types'
import { TContextualUser } from '../../schema/user'
import { TAccessKey } from './TAccessKey'
import CLEARANCE_LEVEL from './clearance.level'

export default class Access {
  static GATE: Readonly<Record<TAccessKey, number>> = {
    'create.bookmark': CLEARANCE_LEVEL.free,
    'read.unpublished.bookmark': CLEARANCE_LEVEL.moderator,
    'read.user.collection': CLEARANCE_LEVEL.moderator,
    'get.user': CLEARANCE_LEVEL.moderator,
    'dev_install_page.view': CLEARANCE_LEVEL.developer,
    'bookmark.publish': CLEARANCE_LEVEL.supporter,
    'bookmark.moderate': CLEARANCE_LEVEL.moderator,
    'user.admin': CLEARANCE_LEVEL.administrator,
    'user.get': CLEARANCE_LEVEL.moderator,
    'system.developer': CLEARANCE_LEVEL.developer,
    // TODO: Add more access actions and their required clearance above
  }
  /** Contextual user's role */
  get role(): TRole { return this._usr?.role ?? 'guest' }
  /** Contextual user */
  private _usr?: TContextualUser
  // constructor(role?: TRole) { this._role = role ?? 'free' }
  constructor(usr?: TContextualUser) { this._usr = usr }
  // static withRole = (role?: TRole) => new Access(role)
  static the = (usr?: TContextualUser) => new Access(usr)
  /** @returns `true` if the contextual user **can** perform the following action */
  can = (key: TAccessKey) => {
    return CLEARANCE_LEVEL[this.role] >= Access.GATE[key]
  }
  /** @returns `true` if the contextual user **cannot** perform the following action */
  cannot = (key: TAccessKey) => {
    return CLEARANCE_LEVEL[this.role] < Access.GATE[key]
  }
  cant = this.cannot
  /** @returns `true` if the contextual user can **view** the resource */
  canRead = (resource: IResource): boolean => {
    return this._usr?._id === resource?.user_id
      || CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
  }
  /**
   * @returns `true` if the contextuall user can **view** the sensitive resource
   */
  canReadSensitive = (resource: IResourceSensitive) => {
    return this._usr?._id === resource._id
      || CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
  }
  /** @returns `true` if the contextual user can **modified** the resource */
  canEdit = (resource: IResource): boolean => {
    const inceptionClearance = resource.inception_clearance ?? 0
    return this._usr?._id === resource.user_id
      || (CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
        && CLEARANCE_LEVEL[this.role] > inceptionClearance
      )
  }
  /**
   * @returns `true` if the contextual user can **edit** the sensitive resource
   */
  canEditSensitive = (resource: IResourceSensitive) => {
    const inceptionClearance = resource.inception_clearance ?? 0
    return this._usr?._id === resource._id
      || (CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
        && CLEARANCE_LEVEL[this.role] > inceptionClearance
      )
  }
  /** @returns `true` if the contextual user can **delete** the resource */
  canDelete = (resource: IResource): boolean => {
    const inceptionClearance = resource.inception_clearance ?? 0
    return this._usr?._id === resource.user_id
      || (CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
        && CLEARANCE_LEVEL[this.role] > inceptionClearance
      )
  }
  /**
   * @returns `true` if the contextual user cannot **view** the resource
   */
  cannotRead = (resource: IResource): boolean => {
    return !this.canRead(resource)
  }
  /**
   * @returns `true` if the contextual user cannot **view** the sensitive resource
   */
  cannotReadSensitive = (resource: IResourceSensitive) => {
    return !this.canReadSensitive(resource)
  }
  /** @returns `true` if the contextual user cannot **edit** the resource */
  cannotEdit = (resource: IResource): boolean => {
    return !this.canEdit(resource)
  }
  /**
   * @returns `true` if the contextual user cannot **edit** the sensitive resource
   */
  cannotEditSensitive = (resource: IResourceSensitive) => {
    return !this.canEditSensitive(resource)
  }
}
