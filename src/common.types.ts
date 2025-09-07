import { TCipheredUser } from './schema/users';
import { TNetState } from './shared';

export type TStateResponse = { 'state': TNetState };

// Utility types
export type TObj<T=unknown> = Record<string, T>;

/** Make properties required. @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Make properties optional. */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/** Type for excluding or including mongodb document fields */
export type TSelect<T=TObj> = Record<keyof T, 0|1>;

/** @deprecated */
export type TSelectOriginal<T> = { [P in keyof T]: 0|1 };

export interface IAggregateDoc {
  _id: string;
  __v: number;
}

// Mongoose document interfaces
export interface IMPV2Doc<T = unknown> { 
  _doc: T & IAggregateDoc;
}

// Platform types
export type TPlatform = '_blank'
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'rumble'
  | 'odysee'
  | 'twitch'
  | 'facebook'
  | 'bitchute'
  | 'unknown';

// Endpoint types
export type TEndpoint = 'users'| 'entries' | 'bookmarks' | 'tags'
| 'authorizations' | 'listings';

/** State map type */
export interface IStateMapEntry<T = unknown> {
  state: T;
  clearance?: string;
}

export interface IStateMap {
  [entry: string]: IStateMapEntry;
}

// Theme types
export type TThemeMode = 'light' | 'dark';

/** Generic JSON API query string */
export interface IJsonapiQuerystring {
  'page[number]'?: string;
  'page[size]'?: string;
  'query'?: string;
  'filter[is_published]'?: string;
  'filter[is_active]'?: string;
  'filter[search]'?: string;
}

/** Values that may be needed to customize the returned bootstrap state. */
export interface IStateContext {
  usr?: TCipheredUser;
  token?: string;
  theme?: TThemeMode;
}

/** Dedicated to managing requested states from server. */
export type TBootstrapState<T> = Record<string, T | ((context: IStateContext) => T)>;