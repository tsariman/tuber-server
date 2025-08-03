import { TJsonapiMeta } from '../../shared/interfaces/IJsonapi';
import {
  TJsonapiDataAttributes,
  TJsonapiPaginationLinks,
  TJsonapiResource,
  TJsonapiResponse,
} from '../../shared';

export default class JsonapiResponseBuilder<T = TJsonapiDataAttributes> {
  private _dataMember: TJsonapiResource<T>;
  private _meta?: TJsonapiMeta;
  private _links?: TJsonapiPaginationLinks;
  private _included?: TJsonapiResource[];

  constructor(attributes?: T, type = 'resource') {
    this._dataMember = {
      type,
      attributes,
    };
  }

  setId(id: string | number): this {
    this._dataMember.id = id.toString();
    return this;
  }

  setType(type: string): this {
    this._dataMember.type = type;
    return this;
  }

  setAttributes(attributes: T): this {
    this._dataMember.attributes = attributes;
    return this;
  }

  addAttribute<K extends keyof T>(key: K, val: T[K]): this {
    this._dataMember.attributes ??= {} as T;
    this._dataMember.attributes[key] = val;
    return this;
  }

  addRelationship(name: string, data: TJsonapiResource | TJsonapiResource[]): this {
    if (!this._dataMember.relationships) {
      this._dataMember.relationships = {};
    }
    
    // Convert resource(s) to resource linkage format
    const linkageData = Array.isArray(data) 
      ? data.map(resource => ({ type: resource.type, id: resource.id || '' }))
      : { type: data.type, id: data.id || '' };
    
    this._dataMember.relationships[name] = { data: linkageData };
    return this;
  }

  setMeta(meta: TJsonapiMeta): this {
    this._meta = meta;
    return this;
  }

  setLinks(links: TJsonapiPaginationLinks): this {
    this._links = links;
    return this;
  }

  addLink<K extends keyof TJsonapiPaginationLinks>(
    key: K,
    val: TJsonapiPaginationLinks[K]
  ): this {
    this._links ??= { self: '' };
    this._links[key] = val;
    return this;
  }

  addIncluded(resource: TJsonapiResource): this {
    if (!this._included) {
      this._included = [];
    }
    this._included.push(resource);
    return this;
  }

  build() {
    const response: TJsonapiResponse<T> = {
      data: this._dataMember,
    };

    if (this._meta) {
      response.meta = this._meta;
    }

    if (this._links) {
      response.links = this._links;
    }

    if (this._included && this._included.length > 0) {
      response.included = this._included;
    }

    return response;
  }

  buildArray(resources: TJsonapiResource<T>[]): TJsonapiResponse<T> {
    const response: TJsonapiResponse<T> = {
      data: resources,
    };

    if (this._meta) {
      response.meta = this._meta;
    }

    if (this._links) {
      response.links = this._links;
    }

    if (this._included && this._included.length > 0) {
      response.included = this._included;
    }

    return response;
  }
}