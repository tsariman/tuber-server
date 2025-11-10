import {
  TJsonapiLink,
  TJsonapiResource,
  TJsonapiResourceLinkage,
  TJsonapiResponse,
  TNetState,
} from '@tuber/shared';
import {
  IAggregateDoc,
  IMPV2Doc,
  TEndpoint,
  TObj
} from '../../common.types';
import { die, has_property } from '../../utility';
import JsonapiPaginationBuilder, { 
  IMinimalPaginationOptions,
  IPaginatedResult,
  get_pagination_options
} from './JsonapiPaginationBuilder';

type JSONAPI_RESOURCE_TYPE = 'collection' | 'object' | 'null' | 'linkage';

/** Jsonapi response collection builder @deprecated */
export default class JsonapiResponseColBuilder<TCollection> {
  readonly JSONAPI_VERSION = '1.1';
  private _skeletonResource: TJsonapiResource;
  private _response: TJsonapiResponse;
  private readonly RESOURCE_OF_TYPE: {[key in JSONAPI_RESOURCE_TYPE]: TJsonapiResponse['data']} = {
    'collection': [] as TJsonapiResource[],
    'object': {} as TJsonapiResource,
    'null': null,
    'linkage': {} as TJsonapiResourceLinkage
  };
  private _resourceType: JSONAPI_RESOURCE_TYPE;
  /** Filter to remove unwanted properties @deprecated */
  private _resourceFilter: <T>(entity: T) => T;
  private _dataMember: TCollection;
  private _alreadyBuilt: boolean;

  constructor(
    data: TCollection,
    endpoint: TEndpoint,
    type: JSONAPI_RESOURCE_TYPE = 'collection'
  ) {
    this._response = {
      jsonapi: { version: this.JSONAPI_VERSION }
    };
    this._response.data = [];
    this._skeletonResource = { type: endpoint };
    this._resourceFilter = <T=unknown>(): T => {
      die('Resource filter not set.');
      return { _doc: {} } as T;
    };
    this._resourceType = type;
    this._dataMember = data;
    this._alreadyBuilt = false;
  }

  toString = () => this._response;

  /** Get the function that filter resource. @deprecated */
  getResourceFilter = () => this._resourceFilter;

  setResourceFilter = <T>(fn: T) => {
    this._resourceFilter = fn as typeof this._resourceFilter;
    return this;
  }

  buildLinks = (mOpts: IMinimalPaginationOptions) => {
    const opts = get_pagination_options(mOpts);
    this._response.links = new JsonapiPaginationBuilder(opts).build();
    return this;
  }

  buildPaginationV2Links = (opts: IPaginatedResult) => {
    this._response.links = new JsonapiPaginationBuilder(opts).build();
    return this;
  }

  link = (key: string, val: string) => {
    this._response.links = this._response.links || { self: '' };
    this._response.links[key] = val;
    return this;
  }

  hrefLink = <T>(key: string, href: string, meta: T) => {
    this._response.links = this._response.links || { self: '' };
    const link: TJsonapiLink = { href };
    if (meta) {
      link.meta = meta;
    }
    this._response.links[key] = link;
    return this;
  }

  meta = <T>(key: string, val: T) => {
    this._response.meta = this._response.meta || {};
    this._response.meta[key] = val;
    return this;
  }

  state = (s: { state: TNetState}) => {
    if (has_property(s, 'state')) {
      this._response.state = s.state;
    }
    return this;
  }

  /** Per Jsonapi specification, the raw data must be a string. @deprecated */
  private _applyStringSpecification = (obj: TObj): TObj => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      switch (typeof value) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'symbol':
          obj[key] = value.toString();
          break;
        case 'string':
          obj[key] = value.trim();
          break;
        case 'object':
          if (value === null) {
            break;
          } 
          if (Array.isArray(value)) {
            obj[key] = value.map(
              item => this._applyStringSpecification(item)
            );
          } else {
            obj[key] = this._applyStringSpecification(value as TObj);
          }
          break;
        case 'undefined':
        case 'function':
        default:
      }
    });
    return obj;
  }

  /** Get the resource for mongoose-pagination-v2 @deprecated */
  private getMPV2Resource = <T>(data: TCollection & IMPV2Doc<T>): TJsonapiResource => {
    // const attributes = this.resourceFilter(data)
    const { _doc: { _id, ...attributes } } = data;
    return {
      ...this._skeletonResource,
      id: data._doc._id,
      attributes: this._applyStringSpecification(attributes)
    } as TJsonapiResource;
  }

  /** Build the response for mongoose-paginate-v2 */
  mPaginationV2build() {
    if (this._alreadyBuilt) {
      throw new Error('Response already built');
    }
    this._response.data = this.RESOURCE_OF_TYPE[this._resourceType];
    switch (this._resourceType) {
      case 'collection':
        this._response.data = (this._dataMember as (TCollection & IMPV2Doc)[]).map(
          item => this.getMPV2Resource(item)
        );
        break;
      case 'object':
        this._response.data = this.getMPV2Resource(this._dataMember as TCollection & IMPV2Doc);
        break;
      case 'linkage':
        throw new Error('Not implemented');
      case 'null':
        this._response.data = null;
        break;
    }

    this._alreadyBuilt = true;
    return this._response;
  }

  /** Get the resource */
  private getResource = (data: TCollection & IAggregateDoc): TJsonapiResource => {
    const { _id, __v, ...attributes } = data;
    return {
      ...this._skeletonResource,
      id: data._id,
      attributes
    } as TJsonapiResource;
  };

  build() {
    if (this._alreadyBuilt) {
      throw new Error('Response already built');
    }
    this._response.data = this.RESOURCE_OF_TYPE[this._resourceType];
    switch (this._resourceType) {
      case 'collection':
        this._response.data = (this._dataMember as (TCollection & IAggregateDoc)[]).map(
          item => this.getResource(item)
        );
        break;
      case 'object':
        this._response.data = this.getResource(
          this._dataMember as TCollection & IAggregateDoc
        );
        break;
      case 'linkage':
        throw new Error('Not implemented');
      case 'null':
        this._response.data = null;
        break;
    }

    this._alreadyBuilt = true;
    return this._response;
  }
}