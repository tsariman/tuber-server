import type { TJsonapiRequest } from '@tuber/shared'
import type { TContextualUser } from './schema/user'

// Utility types

export type TAllTypes = 'string'
  |'number'
  |'bigint'
  |'boolean'
  |'function'
  |'object'
  |'symbol'
  |'undefined'

export type TObj<T=unknown> = Record<string, T>

/** Make properties required. @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/** Make properties optional. */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/** Type for excluding or including mongodb document fields */
export type TSelect<T=TObj> = Record<keyof T, 0|1>

/** @deprecated */
export type TSelectOriginal<T> = { [P in keyof T]: 0|1 }

export interface IAggregateDoc { _id: string; __v: number }

export interface IResource {
  user_id?: string
  inception_clearance?: number
}

export interface IResourceSensitive {
  _id?: string
  inception_clearance?: number
}

/** Mongoose document interfaces */
export interface IMPV2Doc<T = unknown> { _doc: T & IAggregateDoc }

/** Possible user role */
export type TRole = 'owner'
  | 'developer'
  | 'administrator'
  | 'moderator'
  | 'supporter'
  | 'member'
  | 'patron'
  | 'sponsor'
  | 'investor'
  | 'donor'
  | 'free'
  | 'guest'

/** Platform types */
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

/** Endpoint types */
export type TEndpoint = 'users'
  | 'entries'
  | 'bookmarks'
  | 'tags'
  | 'authorizations'
  | 'listings'

/** State map type */
export interface IStateMapEntry<T = unknown> {
  state: T
  clearance?: string
}

export interface IStateMap {
  [entry: string]: IStateMapEntry
}

/** Theme types */
export type TThemeMode = 'light' | 'dark'

/** Generic JSON API query string */
export interface IJsonapiQuerystring {
  'page[number]'?: string
  'page[size]'?: string
  'query'?: string
  'filter[is_published]'?: string
  'filter[is_active]'?: string
  'filter[search]'?: string
}

/** Values that may be needed to customize the returned bootstrap state. */
export interface IStateContext {
  usr?: TContextualUser
  token?: string
  theme?: TThemeMode
}

/** Dedicated to managing requested states from server. */
export type TBootstrapState<T> = Record<string, T | ((context: IStateContext) => T)>

/**
 * Type for textfield adornment, e.g.
 *
 * icons and text symbol located within the textfield that serve as a type of
 * label. e.g.  
 * ```json
 * {
 *   'type': 'textfield',
 *   'name': 'machine_name',
 *   'props': {}, // Maerial-ui props
 *   'inputProps': {
 *     'start': { // IAdornment start here
 *       'icon': {},
 *       'faIcon': (),
 *        
 *     }
 *   }
 * }
 * ```
 */
export interface IAdornment {
  position?: 'start' | 'end'
  type?: 'text' | 'button'
  /** Material-UI icon */
  icon?: string
  /** Fontawesone icon */
  faIcon?: string
  text?: string
  [x: string]: unknown
}

/** Convert an array to a collection. The `add()` method **must** be implemented. */
export interface ICollection<T = unknown> {
  items: T[]
  add: (element: T) => void
}

/** [**username**] & [**password**] to login at `POST /signin` endpoint. */
export interface IRequestAuth {
  Body: TJsonapiRequest<{
    credentials?: {
      username?: string
      password?: string
      options?: string[]
    }
    route?: string
    theme_mode?: TThemeMode
    cookie?: string
  }>
}

/** [**variable**] Query string for environment variables endpoint */
export interface IQueryEnvVar {
  Querystring: {
    var?: string
  }
}

/**
 * [**directive**] instruction for testing user endpoint. Query string for 
 * `POST /dev/users` endpoint
 */
export interface IQueryDirective { Querystring: { d?: string } }

/** [**Key**] & [**Theme Mode**] Body data for `POST /state/*` endpoint */
export interface IStatePost {
  Body: {
    key?: string
    theme_mode?: TThemeMode
  }
}

/**
 * Search mode for bookmark searches
 * 'public' - search only published bookmarks, excluding user's published bookmarks
 * 'private' - search only user's bookmarks, whether they're published or not
 * 'all' - search published bookmarks and user's own bookmarks, regardless of
 *         publication status
 */
export type TSearchMode = 'public' | 'private' | 'all'