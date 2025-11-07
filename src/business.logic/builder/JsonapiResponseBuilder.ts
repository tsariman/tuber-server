import { PaginateResult } from 'mongoose';
import {
  TJsonapiDataLinkage,
  TJsonapiMeta,
  TJsonapiDataAttributes,
  TJsonapiPaginationLinks,
  TJsonapiResource,
  TJsonapiResponse,
} from '@tuber/shared';
import JsonapiPaginationBuilder, { 
  IMinimalPaginationOptions,
  IPaginatedResult,
  get_pagination_options
} from './JsonapiPaginationBuilder';

export default class JsonapiResponseBuilder<T = TJsonapiDataAttributes> {
  private _data: TJsonapiResource<T>[] | TJsonapiResource<T> | null = null;
  private _meta?: TJsonapiMeta;
  private _links?: TJsonapiPaginationLinks;
  private _included?: TJsonapiResource[];

  private constructor() {
    // Private constructor - use factory methods instead
  }

  /**
   * Create a builder for a single resource response
   */
  static forSingleResource<T = TJsonapiDataAttributes>(
    attributes?: T, 
    type = 'resource'
  ): JsonapiResponseBuilder<T> {
    const builder = new JsonapiResponseBuilder<T>();
    if (attributes !== undefined) {
      builder._data = {
        type,
        attributes,
      };
    }
    return builder;
  }

  /**
   * Create a builder for a collection response
   */
  static forCollection<T = TJsonapiDataAttributes>(): JsonapiResponseBuilder<T> {
    const builder = new JsonapiResponseBuilder<T>();
    builder._data = [];
    return builder;
  }

  /**
   * Create an empty builder (for responses with only meta/links)
   */
  static empty<T = TJsonapiDataAttributes>(): JsonapiResponseBuilder<T> {
    return new JsonapiResponseBuilder<T>();
  }

  withId(id: unknown): this {
    if (!this._data || Array.isArray(this._data)) {
      throw new Error('Cannot set ID on null data or collection. Use setData() first.');
    }
    
    switch (typeof id) {
      case 'string':
        this._data.id = id;
        break;
      case 'number':
        this._data.id = id.toString();
        break;
    }
    return this;
  }

  withType(type: string): this {
    if (!this._data || Array.isArray(this._data)) {
      throw new Error('Cannot set type on null data or collection. Use setData() first.');
    }
    
    this._data.type = type;
    return this;
  }

  withData(data: TJsonapiResource<T>): this {
    this._data = data;
    return this;
  }

  withDataNull(): this {
    this._data = null;
    return this;
  }

  withCollection(resources: TJsonapiResource<T>[] = []): this {
    this._data = resources;
    return this;
  }

  /**
   * Convert database documents to JSON:API resources
   * @param dbDocs - Array of database documents
   * @param resourceType - The JSON:API resource type
   * @param transform - Optional transformation function for attributes
   */
  withDocuments<TDoc = Record<string, unknown>>(
    dbDocs: TDoc[],
    resourceType: string,
    transform?: (doc: TDoc) => T
  ): this {
    if (!Array.isArray(dbDocs)) {
      throw new Error('toResources: dbDocs must be an array');
    }

    const resources = dbDocs.map((doc) => {
      if (!doc || typeof doc !== 'object') {
        throw new Error('withDocuments(): Invalid document structure');
      }

      const resource: TJsonapiResource<T> = {
        type: resourceType
      };

      // Handle ID extraction and conversion
      const docWithId = doc as Record<string, unknown>;
      if ('_id' in docWithId) {
        resource.id = String(docWithId._id); // Convert ObjectId to string
      } else if ('id' in docWithId) {
        resource.id = String(docWithId.id);
      }

      // Extract attributes (excluding MongoDB meta fields)
      const excludeFields = ['_id', 'id', '__v'];
      const attributes = Object.fromEntries(
        Object.entries(docWithId).filter(([key]) => !excludeFields.includes(key))
      );

      // Apply optional transformation or use extracted attributes
      resource.attributes = transform ? transform(doc) : attributes as T;

      return resource;
    });

    this._data = resources;
    return this;
  }

  addResource(resource: TJsonapiResource<T>): this {
    if (!Array.isArray(this._data)) {
      this._data = [];
    }
    this._data.push(resource);
    return this;
  }

  withAttributes(attributes: T): this {
    if (!this._data || Array.isArray(this._data)) {
      throw new Error('Cannot set attributes on null data or collection. Use setData() first.');
    }
    
    this._data.attributes = attributes;
    return this;
  }

  addAttribute<K extends keyof T>(key: K, val: T[K]): this {
    if (!this._data || Array.isArray(this._data)) {
      throw new Error('Cannot add attribute on null data or collection. Use setData() first.');
    }
    
    this._data.attributes ??= {} as T;
    this._data.attributes[key] = val;
    return this;
  }

  addRelationship(name: string, data: TJsonapiResource | TJsonapiResource[]): this {
    if (!this._data || Array.isArray(this._data)) {
      throw new Error('Cannot add relationship on null data or collection. Use setData() first.');
    }
    
    this._data.relationships ??= {};

    // Convert resource(s) to resource linkage format
    // Validate that resources have required id and type
    const linkageData = Array.isArray(data) 
      ? data.map(resource => {
          if (!resource.id || !resource.type) {
            throw new Error('Resource linkage requires both type and id');
          }
          return { type: resource.type, id: resource.id };
        })
      : (() => {
          if (!data.id || !data.type) {
            throw new Error('Resource linkage requires both type and id');
          }
          return { type: data.type, id: data.id };
        })();
    
    this._data.relationships[name] = { data: linkageData };
    return this;
  }

  withMeta(meta: TJsonapiMeta): this {
    this._meta = meta;
    return this;
  }

  withLinks(links: TJsonapiPaginationLinks): this {
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
    this._included ??= [];
    this._included.push(resource);
    return this;
  }

  /**
   * Add relationship with resource linkage only (spec compliant)
   */
  addRelationshipLinkage(name: string, linkage: TJsonapiDataLinkage): this {
    if (!this._data || Array.isArray(this._data)) {
      throw new Error('Cannot add relationship on null data or collection. Use setData() first.');
    }
    
    this._data.relationships ??= {};
    
    // Handle null case for empty to-one relationships
    if (linkage === null) {
      this._data.relationships[name] = { data: [] };
    } else {
      this._data.relationships[name] = { data: linkage };
    }
    
    return this;
  }

  /**
   * Build pagination links using minimal options
   */
  withPagination(options: IMinimalPaginationOptions): this {
    const paginationOpts = get_pagination_options(options);
    this._links = new JsonapiPaginationBuilder(paginationOpts).build();
    return this;
  }

  /**
   * Build pagination links using full pagination result
   */
  withPaginationLinks(paginatedResult: IPaginatedResult): this {
    this._links = new JsonapiPaginationBuilder(paginatedResult).build();
    return this;
  }

  /**
   * Handle complete mongoose-paginate-v2 result with documents and pagination
   * @param result - PaginateResult from mongoose-paginate-v2
   * @param resourceType - JSON:API resource type
   * @param transform - Optional transformation function for documents
   * @param filter - Optional filter string for pagination links
   */
  withMongoosePaginatedResult<TDoc = Record<string, unknown>>(
    result: PaginateResult<TDoc>,
    resourceType: string,
    transform?: (doc: TDoc) => T,
    filter?: string
  ): this {
    // Convert documents to JSON:API resources
    this.withDocuments(result.docs, resourceType, transform);
    
    // Build pagination links
    this._links = new JsonapiPaginationBuilder({
      totalDocs: result.totalDocs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      nextPage: result.nextPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      hasPrevPage: result.hasPrevPage,
      pagingCounter: result.pagingCounter,
      filter
    }).build();
    
    return this;
  }

  /**
   * Add pagination for collection responses with automatic calculation
   */
  withCollectionPagination(
    totalDocs: number,
    page = 1,
    limit = 10,
    filter?: string
  ): this {
    const options: IMinimalPaginationOptions = {
      page,
      limit,
      totalDocs,
      filter
    };
    return this.withPagination(options);
  }

  /**
   * Validates the current builder state against JSON:API specification
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check if we have at least one required top-level member
    if (this._data === null && !this._meta) {
      errors.push('Document must contain at least one of: data, errors, or meta');
    }
    
    // Validate resource objects have required members
    if (this._data) {
      const resources = Array.isArray(this._data) ? this._data : [this._data];
      
      resources.forEach((resource, index) => {
        if (!resource.type) {
          errors.push(`Resource at index ${index} missing required 'type' member`);
        }
        
        // ID is required except for client-generated resources
        if (!resource.id && resource.id !== undefined) {
          errors.push(`Resource at index ${index} has invalid 'id' member`);
        }
      });
    }
    
    // Validate included resources
    if (this._included) {
      this._included.forEach((resource, index) => {
        if (!resource.type) {
          errors.push(`Included resource at index ${index} missing required 'type' member`);
        }
        if (!resource.id) {
          errors.push(`Included resource at index ${index} missing required 'id' member`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  build(): TJsonapiResponse<T> {
    // Validate that we have either data, errors, or meta (spec requirement)
    if (this._data === null && !this._meta) {
      throw new Error('JSON:API document must contain at least one of: data, errors, or meta');
    }

    const response: TJsonapiResponse<T> = {
      data: this._data,
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

  buildCollection(): TJsonapiResponse<T> {
    // Ensure we're working with an array for collection responses
    if (!Array.isArray(this._data)) {
      this._data = [];
    }
    
    const response: TJsonapiResponse<T> = {
      data: this._data,
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