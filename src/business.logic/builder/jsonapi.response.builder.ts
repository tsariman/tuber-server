import {
  IAggregateDoc,
  IMPV2Doc,
  TEndpoint,
  TJsonapiLink,
  TJsonapiResource,
  TJsonapiResourceLinkage,
  TJsonapiResponse,
  TNetState,
  TObj
} from '../../common.types';
import JsonapiResponsePaginationBuilder, { 
  IMinimalPaginationOptions,
  IPaginatedResult,
  get_pagination_options
} from './jsonapi.pagination.builder';
import Config from '../../config';
import { has_property } from '../index';

type JSONAPI_RESOURCE_TYPE = 'collection' | 'object' | 'null' | 'linkage';

export default class JsonapiResponseBuilder<TCollection> {
  readonly JSONAPI_VERSION = '1.1';
  private skeletonResource: TJsonapiResource;
  private response: TJsonapiResponse;
  private readonly RESOURCE_OF_TYPE: {[key in JSONAPI_RESOURCE_TYPE]: TJsonapiResponse['data']} = {
    'collection': [] as TJsonapiResource[],
    'object': {} as TJsonapiResource,
    'null': null,
    'linkage': {} as TJsonapiResourceLinkage
  };
  private resourceType: JSONAPI_RESOURCE_TYPE;
  /** Filter to remove unwanted properties @deprecated */
  private resourceFilter: <T>(entity: T) => T;
  private dataMember: TCollection;
  private alreadyBuilt: boolean;

  constructor(
    data: TCollection,
    endpoint: TEndpoint,
    type: JSONAPI_RESOURCE_TYPE = 'collection'
  ) {
    this.response = {
      jsonapi: { version: this.JSONAPI_VERSION }
    };
    this.response.data = [];
    this.skeletonResource = { type: endpoint };
    this.resourceFilter = <T=unknown>(): T => {
      Config.die('Resource filter not set.');
      return { _doc: {} } as T;
    };
    this.resourceType = type;
    this.dataMember = data;
    this.alreadyBuilt = false;
  }

  toString = () => this.response;

  /** Get the function that filter resource. @deprecated */
  getResourceFilter = () => this.resourceFilter;

  setResourceFilter = <T>(fn: T) => {
    this.resourceFilter = fn as typeof this.resourceFilter;
    return this;
  }

  buildLinks = (mOpts: IMinimalPaginationOptions) => {
    const opts = get_pagination_options(mOpts);
    this.response.links = new JsonapiResponsePaginationBuilder(opts).build();
    return this;
  }

  buildPaginationV2Links = (opts: IPaginatedResult) => {
    this.response.links = new JsonapiResponsePaginationBuilder(opts).build();
    return this;
  }

  link = (key: string, val: string) => {
    this.response.links = this.response.links || { self: '' };
    this.response.links[key] = val;
    return this;
  }

  hrefLink = <T>(key: string, href: string, meta: T) => {
    this.response.links = this.response.links || { self: '' };
    const link: TJsonapiLink = { href };
    if (meta) {
      link.meta = meta;
    }
    this.response.links[key] = link;
    return this;
  }

  meta = <T>(key: string, val: T) => {
    this.response.meta = this.response.meta || {};
    this.response.meta[key] = val;
    return this;
  }

  state = (s: { state: TNetState}) => {
    if (has_property(s, 'state')) {
      this.response.state = s.state;
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
      ...this.skeletonResource,
      id: data._doc._id,
      attributes: this._applyStringSpecification(attributes)
    } as TJsonapiResource;
  }

  /** Build the response for mongoose-paginate-v2 @deprecated */
  mPaginationV2build() {
    if (this.alreadyBuilt) {
      throw new Error('Response already built');
    }
    this.response.data = this.RESOURCE_OF_TYPE[this.resourceType];
    switch (this.resourceType) {
      case 'collection':
        this.response.data = (this.dataMember as (TCollection & IMPV2Doc)[]).map(
          item => this.getMPV2Resource(item)
        );
        break;
      case 'object':
        this.response.data = this.getMPV2Resource(this.dataMember as TCollection & IMPV2Doc);
        break;
      case 'linkage':
        throw new Error('Not implemented');
      case 'null':
        this.response.data = null;
        break;
    }

    this.alreadyBuilt = true;
    return this.response;
  }

  /** Get the resource */
  private getResource = (data: TCollection & IAggregateDoc): TJsonapiResource => {
    const { _id, __v, ...attributes } = data;
    return {
      ...this.skeletonResource,
      id: data._id,
      attributes
    } as TJsonapiResource;
  };

  build() {
    if (this.alreadyBuilt) {
      throw new Error('Response already built');
    }
    this.response.data = this.RESOURCE_OF_TYPE[this.resourceType];
    switch (this.resourceType) {
      case 'collection':
        this.response.data = (this.dataMember as (TCollection & IAggregateDoc)[]).map(
          item => this.getResource(item)
        );
        break;
      case 'object':
        this.response.data = this.getResource(
          this.dataMember as TCollection & IAggregateDoc
        );
        break;
      case 'linkage':
        throw new Error('Not implemented');
      case 'null':
        this.response.data = null;
        break;
    }

    this.alreadyBuilt = true;
    return this.response;
  }
}