
/** @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/** Make properties optional */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/** Shallow mongoose document type that contains only the _doc property. */
export interface IDoc<T=any> { _doc: T }

/** Names of collection endpoint */
export type TEndpoint = 'users' | 'entries' | 'notes'
