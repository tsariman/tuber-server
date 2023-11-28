import {
  IJsonapiError,
  IJsonapiErrorLinks,
  IJsonapiErrorResponse,
  IJsonapiErrorSource,
  IJsonapiLink,
  IJsonapiPaginationLinks,
  IJsonapiResource,
  IJsonapiResourceLinkage,
  IJsonapiResponse
} from '../../tuber-client/src/interfaces/IJsonapi'
import { INetState } from '../../tuber-client/src/interfaces/IState'
import IStateAllDialogs from '../../tuber-client/src/interfaces/IStateAllDialogs'
import IStateAllForms from '../../tuber-client/src/interfaces/IStateAllForms'
import IStateAllPages from '../../tuber-client/src/interfaces/IStateAllPages'
import IStateApp from '../../tuber-client/src/interfaces/IStateApp'
import IStateAppBar from '../../tuber-client/src/interfaces/IStateAppBar'
import IStateBackground from '../../tuber-client/src/interfaces/IStateBackground'
import IStateDialog from '../../tuber-client/src/interfaces/IStateDialog'
import { IStatePageDrawer } from '../../tuber-client/src/interfaces/IStateDrawer'
import IStateForm from '../../tuber-client/src/interfaces/IStateForm'
import IStateFormItem from '../../tuber-client/src/interfaces/IStateFormItem'
import IStateLink from '../../tuber-client/src/interfaces/IStateLink'
import IStatePage from '../../tuber-client/src/interfaces/IStatePage'

/** `INetState` interface imported form client. */
export type TNetState = INetState
export type TStateApp = IStateApp
export type TStateAllPages = IStateAllPages
export type TStateAllForms = IStateAllForms
export type TStateAllDialogs = IStateAllDialogs
export type TStatePage = IStatePage
export type TStateAppBar = IStateAppBar
export type TStatePageDrawer = IStatePageDrawer
export type TStateDialog<T=any> = IStateDialog<T>
export type TStateForm = IStateForm
export type TStateFormItem = IStateFormItem
export type TStateLink<T=any> = IStateLink<T>
export type TStateBackground = IStateBackground
export type TIJsonapiError = IJsonapiError
export type TJsonapiErrorLinks = IJsonapiErrorLinks
export type TJsonapiErrorResponse = IJsonapiErrorResponse
export type TJsonapiErrorSource = IJsonapiErrorSource
export type TJsonapiLink = IJsonapiLink
export type TJsonapiPaginationLinks = IJsonapiPaginationLinks
export type TJsonapiResource<T=any> = IJsonapiResource<T>
export type TJsonapiResourceLinkage = IJsonapiResourceLinkage
export type TJsonapiResponse = IJsonapiResponse

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
export type TEndpoint = 'users' | 'entries' | 'bookmarks' | 'tags' | 'authorizations'

/**
 * Use when assigning values to object properties using a string as the key.  
 * e.g.
 * ```ts
 * const obj: IGenericObject = {}
 * obj['key'] = 'value'
 * ```
 */
export interface IGenericObject<T=any> { [key: string]: T }

/** Generic jsonapi query string */
export interface IJsonapiQuerystring {
  'page[number]'?: string
  'page[size]'?: string
  'query'?: string
  'filter[is_published]'?: string
  'filter[is_active]'?: string
  'filter[search]'?: string

  // TODO Add more expected query strings
}

export interface IBootstrapResponse {
  state: TNetState
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

export type TThemeMode = 'light' | 'dark'