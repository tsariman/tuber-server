
/** @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/** Make properties optional */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/** Shallow mongoose document type that contains only the _doc property. */
export interface IDoc<T=any> { _doc: T }

/** Names of collection endpoint */
export type TEndpoint = 'users' | 'entries' | 'notes'

/**
 * Use when assigning values to object properties using a string as the key.  
 * e.g.
 * ```ts
 * const obj: IGenericObject = {}
 * obj['key'] = 'value'
 * ```
 */
export interface IGenericObject { [key: string]: any }

/** Generic jsonapi query string */
export interface IJsonapiQuerystring {
  'page[number]'?: string
  'page[size]'?: string
}
