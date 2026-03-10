import { TRole } from '@tuber/shared'

const CLEARANCE_LEVEL: Readonly<Record<TRole, number>> = {
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
  free: 1,
  /** Unauthenticated user */
  guest: 0
}

/** Sentinel value that denies every role, including owners. Use as the default
 *  required clearance when no explicit level has been set (fail-secure). */
export const DENY_ALL = 8

export default CLEARANCE_LEVEL