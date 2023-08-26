
export type TBusinessType = 'hotel' | 'resort' | 'restaurant' | 'development'

export type TRole = 'owner' | 'developer' | 'administrator' | 'moderator' | 'user'

export const ROLE_CLEARANCE_LEVEL: Record<TRole, number> = {
  owner: 7,
  developer: 7,
  administrator: 6,
  moderator: 2,
  user: 1
}

export interface ILoginCredentials {
  username: string
  password: string
}

/** @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
