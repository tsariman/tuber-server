import { TRole } from '@tuber/shared'
import type { IResource, IResourceSensitive } from '../../common.types'
import { TContextualUser } from '../../schema/user'
import { TAccessKey } from './TAccessKey'
import CLEARANCE_LEVEL, { DENY_ALL } from './clearance.level'
import { is_struct, resolve } from '../../utility'

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
    'toggle.search.scope': CLEARANCE_LEVEL.free,
    'publish.bookmark': CLEARANCE_LEVEL.supporter,
    'publish.unknown.bookmark': CLEARANCE_LEVEL.moderator,
    // TODO: Add more access actions and their required clearance above
  }
  /** Contextual user's role */
  get role(): TRole { return this._usr?.role ?? 'guest' }
  /** Contextual user */
  private _usr?: TContextualUser
  private _requiredClearanceLevel = DENY_ALL
  /**
   * The state and path are used for contextualization, allowing the Access
   * class to apply access control logic based on specific parts of the application state.
   */
  private _state?: unknown
  /* The path within the contextualized state that is relevant to the access check. */
  private _path?: string
  constructor(usr?: TContextualUser) { this._usr = usr }
  /**
   * Factory method to create an Access instance with the provided contextual
   * user.
   */
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
    return (this._usr?._id !== undefined && this._usr._id === resource?.user_id)
      || CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
  }
  /**
   * @returns `true` if the contextuall user can **view** the sensitive resource
   */
  canReadSensitive = (resource: IResourceSensitive) => {
    return (this._usr?._id !== undefined && this._usr._id === resource._id)
      || CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
  }
  /** @returns `true` if the contextual user can **modified** the resource */
  canEdit = (resource: IResource): boolean => {
    const inceptionClearance = resource.inception_clearance ?? 0
    return (this._usr?._id !== undefined && this._usr._id === resource.user_id)
      || (CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
        && CLEARANCE_LEVEL[this.role] > inceptionClearance
      )
  }
  /**
   * @returns `true` if the contextual user can **edit** the sensitive resource
   */
  canEditSensitive = (resource: IResourceSensitive) => {
    const inceptionClearance = resource.inception_clearance ?? 0
    return (this._usr?._id !== undefined && this._usr._id === resource._id)
      || (CLEARANCE_LEVEL[this.role] >= CLEARANCE_LEVEL.moderator
        && CLEARANCE_LEVEL[this.role] > inceptionClearance
      )
  }
  /** @returns `true` if the contextual user can **delete** the resource */
  canDelete = (resource: IResource): boolean => {
    const inceptionClearance = resource.inception_clearance ?? 0
    return (this._usr?._id !== undefined && this._usr._id === resource.user_id)
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
  /**
   * Sets the required clearance level based on the provided role and returns
   * the Access instance to allow chaining. This method is used to specify the 
   * required clearance level for a particular access check before calling the 
   * `decide` method to determine the outcome based on the contextual user's
   * role.
   * @param role The role to set the required clearance level for.
   * @returns The Access instance to allow method chaining.
   */
  hasClearance = (role: TRole) => {
    this._requiredClearanceLevel = CLEARANCE_LEVEL[role]
    return this
  }
  /**
   * Decides which value to return based on whether the contextual user has the
   * required clearance level.  
   * __Note__: This method relies on the `hasClearance` method to set the
   * required clearance level before it can work properly. If `hasClearance` is
   * not called before this method, it will use the default required clearance
   * level which is `DENY_ALL`, effectively denying access to all users
   * including owners.
   * @param granted The value to return if the user has the required clearance
   * @param denied The value to return if the user does not have the required
   *               clearance
   * @returns `granted` if the user has the required clearance, otherwise
   *          `denied`
   */
  decide = <T>(granted: T, denied: T): T => {
    if (CLEARANCE_LEVEL[this.role] >= this._requiredClearanceLevel) {
      return granted
    }
    return denied
  }
  /**
   * Sets the state and path for contextualization.
   * @param state The state object to be contextualized.
   * @param path The path within the state object to be contextualized.
   * @returns The current instance of Access for chaining.
   */
  contextualize(state: unknown, path: string) {
    this._state = state
    this._path = path
    return this
  }
  /** Applies the provided handler function to the contextualized state and path. */
  applyContext(handler: (parent: unknown, value: unknown) => void) {
    if (typeof this._state === 'undefined' || typeof this._path === 'undefined') {
      throw new Error('Access: State or path is not defined for contextualization.')
    }
    const { parent, value } = resolve(this._state, this._path)
    if (is_struct(parent) && typeof value !== 'undefined') {
      handler(parent, value)
    } else {
      throw new Error(`Access: Failed to apply context handler at path "${this._path}". Parent or value is invalid.`)
    }
  }
}
