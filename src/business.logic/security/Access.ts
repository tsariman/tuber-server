import type { IResource, IResourceSensitive, TRole } from '../../common.types'
import { TCipheredUser } from '../../schema/user'
import { TAccessKey } from './TAccessKey'

export default class Access {
  static CLEARANCE_LEVEL: Readonly<Record<TRole, number>> = {
    /** Have ownership and decision making power. ($3000000) */
    owner: 7,
    /** Have ownership privilege and can make request for changes. ($300000) */
    investor: 7,
    /** Have ownership privilege. ($30000) */
    donor: 7,
    developer: 6,
    administrator: 5,
    /** Have administrator privilege ($3000). */
    sponsor: 5,
    moderator: 4,
    /**
     * Have moderator privileges and can publish bookmarks of unknown
     * platforms. ($300)
     */
    patron: 4,
    /**
     * A member account has the same privileges as a supporter account and in
     * addition, the inserted URLs in bookmark notes are visible publicly. ($30)
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
  static GATE: Readonly<Record<TAccessKey, number>> = {
    'read.unpublished.bookmark': Access.CLEARANCE_LEVEL.moderator,
    'read.user.collection': Access.CLEARANCE_LEVEL.moderator,
    'get.user': Access.CLEARANCE_LEVEL.moderator,
    'dev_install_page.view': Access.CLEARANCE_LEVEL.developer,
    'bookmark.publish': Access.CLEARANCE_LEVEL.supporter,
    'bookmark.moderate': Access.CLEARANCE_LEVEL.moderator,
    'user.admin': Access.CLEARANCE_LEVEL.administrator,
    'user.get': Access.CLEARANCE_LEVEL.moderator,
    'system.developer': Access.CLEARANCE_LEVEL.developer,
    // TODO: Add more access actions and their required clearance above
    
  }
  private get _role(): TRole { return this._usr?.role ?? 'free' }
  /** Contextual user */
  private _usr?: TCipheredUser
  // constructor(role?: TRole) { this._role = role ?? 'free' }
  constructor(usr?: TCipheredUser) { this._usr = usr }
  // static withRole = (role?: TRole) => new Access(role)
  static the = (usr?: TCipheredUser) => new Access(usr)
  /** @returns `true` if the contextual user **can** perform the following action */
  can = (key: TAccessKey) => {
    return Access.CLEARANCE_LEVEL[this._role] >= Access.GATE[key]
  }
  /** @returns `true` if the contextual user **cannot** perform the following action */
  cannot = (key: TAccessKey) => {
    return Access.CLEARANCE_LEVEL[this._role] < Access.GATE[key]
  }
  cant = this.cannot
  /** @returns `true` if the contextual user can **view** the resource */
  canRead = (resource: IResource): boolean => {
    return this._usr?._id === resource?.user_id
      || Access.CLEARANCE_LEVEL[this._role] >= Access.CLEARANCE_LEVEL.moderator
  }
  /**
   * @returns `true` if the contextuall user can **view** the sensitive resource
   */
  canReadSensitive = (resource: IResourceSensitive) => {
    return this._usr?._id === resource._id
      || Access.CLEARANCE_LEVEL[this._role] >= Access.CLEARANCE_LEVEL.moderator
  }
  /** @returns `true` if the contextual user can **modified** the resource */
  canEdit = (resource: IResource): boolean => {
    return this._usr?._id === resource.user_id
      || Access.CLEARANCE_LEVEL[this._role] >= Access.CLEARANCE_LEVEL.moderator
  }
  /**
   * @returns `true` if the contextual user can **edit** the sensitive resource
   */
  canEditSensitive = (resource: IResourceSensitive) => {
    return this._usr?._id === resource._id
      || Access.CLEARANCE_LEVEL[this._role] >= Access.CLEARANCE_LEVEL.moderator
  }
  /** @returns `true` if the contextual user can **delete** the resource */
  canDelete = (resource: IResource): boolean => {
    return this._usr?._id === resource.user_id
      || Access.CLEARANCE_LEVEL[this._role] >= Access.CLEARANCE_LEVEL.moderator
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
