import { INetState } from '../../tuber-client/src/controllers/interfaces/IState'

/** @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/** Make properties optional */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/**
 * Shallow mongoose document type that contains only the _doc property.
 * @see https://mongoosejs.com/docs/api/document.html#document_Document-_doc
 * @deprecated
 */
export interface IMPV2Doc<T=any> { _doc: T }

/** Shallow aggregate mongoose document that contains _id */
export interface IAggregateDoc {
  _id: string
  __v: number
}

/** Names of collection endpoint */
export type TEndpoint = 'users' | 'entries' | 'bookmarks'

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
  'query'?: string
  // TODO Add more expected query strings
}

export interface IBootstrapResponse {
  state: INetState
  meta: IGenericObject
}

export type TPlatform = '_blank'
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'rumble'
  | 'odysee'
  | 'twitch'
  | 'facebook'
  | 'bitchute'
  | 'unknown'

export interface IStateMapEntry<T=any> {
  state: T
  clearance?: string
}

export interface IStateMap {
  [entry: string]: IStateMapEntry
}