import type { TRole } from '../../common.types'
import { TCipheredUser } from '../../schema/user'
import { TAccessKey } from './TAccessKey'

export default class Access {
  static CLEARANCE_LEVEL: Readonly<Record<TRole, number>> = {
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
  static GATE: Readonly<Record<TAccessKey, number>> = {
    'dev_install_page.view': Access.CLEARANCE_LEVEL.developer,
    'bookmark.view_unpublished': Access.CLEARANCE_LEVEL.moderator

    // TODO: Add more access actions and their required clearance above
  }
  private _role?: TRole
  constructor(role?: TRole) { this._role = role ?? 'free' }
  static withRole = (role?: TRole) => new Access(role)
  static the = (usr?: TCipheredUser) => new Access(usr?.role ?? 'free')
  withRole = (role: TRole) => {
    this._role = role
    return this
  }
  can = (key: TAccessKey) => {
    if (!this._role) {
      throw new Error(
        'Permission role is not specify. Did you call \'.withRole()\'?'
      )
    }
    return Access.CLEARANCE_LEVEL[this._role] >= Access.GATE[key]
  }
}
