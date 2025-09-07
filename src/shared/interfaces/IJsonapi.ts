import { INetState } from './IState';

export interface IResponseRequirement {
  driver?: string;
  state?: INetState;
}

/* ----------------------------------------------------------------------------
JSONAPI SPECIFICATION
---------------------------------------------------------------------------- */

/**
 * Type for the server response's `jsonapi` member.  
 * An object describing the server’s implementation.
 *
 * _Example Json document_:
 * ```json
 * {
 *    "jsonapi": {} // <-- Type for that member
 * }
 * ```
 * @see https://jsonapi.org/format/#document-jsonapi-object
 */
export interface IJsonapiMember {
  version?: '1.0' | '1.1';
  ext?: string[]; // Extension names
  profile?: string[]; // Profile names
  [key: string]: string | string[] | undefined;
}

/**
 * Type for the server response's `meta` member.
 *
 * _Example Json document_:
 * ```json
 * {
 *    "jsonapi": {},
 *    "meta": {} // <-- type for that member
 * }
 * ```
 * @see https://jsonapi.org/format/#document-meta
 */
export type TJsonapiMeta = Record<string, unknown>;

/**
 * @see https://jsonapi.org/format/#document-links
 */
export interface IJsonapiLinkObject {
  href: string;
  meta?: TJsonapiMeta;
}

export type TJsonapiLink = IJsonapiLinkObject | string | undefined;

export interface IJsonapiErrorLinks {
  about?: IJsonapiLinkObject;
  [prop: string]: TJsonapiLink;
}

export interface IJsonapiErrorSource {
  pointer?: string;
  parameter?: string;
}

/**
 * Type for the server response's `errors` member array elements.
 *
 * _Example Json document_:
 * ```json
 * {
 *    "jsonapi": {},
 *    "meta": {},
 *    "errors": [] // <-- type for elements
 * }
 * ```
 * @see https://jsonapi.org/format/#errors
 */
export interface IJsonapiError {
  id?: string;
  links?: IJsonapiErrorLinks;
  status?: string;
  code: string;
  title: string;
  detail?: string;
  source?: IJsonapiErrorSource;
  meta?: TJsonapiMeta;
}

interface IJsonapiAbstractLinks {
  self?: IJsonapiLinkObject | string;
  related?: IJsonapiLinkObject | string;
}

export interface IJsonapiPageLinks extends IJsonapiAbstractLinks {
  [key: string]: TJsonapiLink;
}

export interface IJsonapiSpecLinks extends IJsonapiAbstractLinks {
  self: IJsonapiLinkObject | string;
}

/**
 * @see https://jsonapi.org/format/#fetching-pagination
 */
export interface IJsonapiPaginationLinks extends IJsonapiSpecLinks {
  first?: IJsonapiLinkObject | string;
  last?: IJsonapiLinkObject | string;
  prev?: IJsonapiLinkObject | string;
  next?: IJsonapiLinkObject | string;
  [key: string]: TJsonapiLink;
}

export interface IJsonapiResourceLinks extends IJsonapiSpecLinks {
  [key: string]: TJsonapiLink;
}

/**
 * @see https://jsonapi.org/format/#document-compound-documents
 */
export interface IJsonapiCompoundDoc {
  type: string;
  id?: string;
}

/**
 * @see https://jsonapi.org/format/#document-resource-object-linkage
 */
export interface IJsonapiResourceLinkage extends IJsonapiCompoundDoc {
  id: string;
}

export interface IJsonapiResourceAbstract {
  meta?: TJsonapiMeta;
  links?: IJsonapiResourceLinks;
}

export type TJsonapiDataLinkage = IJsonapiResourceLinkage | IJsonapiResourceLinkage[] | null;
export type TJsonapiDataCollection = IJsonapiResourceLinkage[];

/**
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 */
export interface IJsonapiRelationship extends IJsonapiResourceAbstract {
  data: TJsonapiDataLinkage;
}
export interface IJsonapiDataRelationships {
  [key: string]: IJsonapiRelationship;
}

/**
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export interface IJsonapiDataAttributes {
  [member: string]: unknown;
}

export interface IJsonapiResource<T=IJsonapiDataAttributes> 
  extends IJsonapiCompoundDoc, IJsonapiResourceAbstract
{
  attributes?: T;
  relationships?: IJsonapiDataRelationships;
}

export interface IJsonapiPageParams {
  number?: number;
  size?: number;
  [key: string]: number | undefined;
}

export interface IJsonapiFilterParams {
  search?: string;
  [key: string]: string | undefined;
}

export interface IJsonapiQueryParams {
  fields?: Record<string, string>;
  include?: string;
  sort?: string;
  page?: IJsonapiPageParams;
  filter?: IJsonapiFilterParams;
}

// RESPONSE SPECIFICATION //

export interface IJsonapiResponseResource<T=IJsonapiDataAttributes>
  extends IJsonapiResourceLinkage, IJsonapiResourceAbstract
{
  attributes: T;
  relationships?: IJsonapiDataRelationships;
}

export interface IJsonapiAbstractResponse extends IResponseRequirement {
  jsonapi?: IJsonapiMember;
}
export interface IJsonapiBaseResponse extends IJsonapiAbstractResponse {
  meta?: TJsonapiMeta;
  links?: IJsonapiPaginationLinks;
}
/** The `meta` member is required. */
export interface IJsonapiMetaResponse extends IJsonapiBaseResponse {
  meta: TJsonapiMeta;
}
/** The `data` member is required. */
export interface IJsonapiDataResponse<T=IJsonapiDataAttributes> extends IJsonapiBaseResponse {
  data: IJsonapiResponseResource<T> | IJsonapiResponseResource<T>[] | null;
  included?: IJsonapiResource[];
}
/** The `errors` member is required. */
export interface IJsonapiErrorResponse extends IJsonapiBaseResponse {
  errors: IJsonapiError[];
}

/**
 * @see https://jsonapi.org/format/#document-top-level
 */
export interface IJsonapiResponse<T=IJsonapiDataAttributes> extends IJsonapiBaseResponse {
  data?: IJsonapiResource<T> | IJsonapiResource<T>[] | IJsonapiResourceLinkage | null;
  errors?: IJsonapiError[];
  included?: IJsonapiResource[];
}

/** Makes the `state` member required while keeping the others optional. */
export interface IJsonapiStateResponse extends IJsonapiResponse {
  state: INetState;
}

// REQUEST SPECIFICATION //

export interface IJsonapiRequestResource<T=IJsonapiDataAttributes>
  extends IJsonapiResourceAbstract, IJsonapiCompoundDoc
{
  attributes?: T;
  relationships?: IJsonapiDataRelationships;
}

export interface IJsonapiAbstractRequest {
  jsonapi?: IJsonapiMember;
}

export interface IJsonapiBaseRequest extends IJsonapiAbstractRequest {
  meta?: TJsonapiMeta;
  links?: IJsonapiPaginationLinks;
}

export interface IJsonapiRequest<T=IJsonapiDataAttributes>
  extends IJsonapiBaseRequest
{
  data?: IJsonapiRequestResource<T>;
  included?: IJsonapiResource[];
}

export interface IJsonapiRequestClient<T=IJsonapiDataAttributes>
  extends IJsonapiRequest<T>
{
  data: IJsonapiRequestResource<T>;
}
