import {
  TJsonapiRequest,
  TJsonapiDataAttributes,
  TJsonapiResource
} from '../common.types';

/**
 * A utility class for accessing values in JSON:API formatted requests.
 * Provides convenient methods to extract data, attributes, relationships,
 * and meta information from JSON:API request payloads.
 */
export default class JsonapiRequestDriver<T = TJsonapiDataAttributes> {
  private _request: TJsonapiRequest<T>;

  constructor(request: TJsonapiRequest<T>) {
    this._request = request || {};
  }

  /**
   * Get the raw request object
   * @returns The original JSON:API request object
   */
  getRequest(): TJsonapiRequest<T> {
    return this._request;
  }

  /**
   * Check if the request has data
   * @returns true if request contains data, false otherwise
   */
  hasData(): boolean {
    return !!this._request.data;
  }

  /**
   * Get the data object from the request
   * @returns The data object or undefined if not present
   */
  getData(): TJsonapiResource<T> | TJsonapiResource<T>[] | undefined {
    return this._request.data;
  }

  /**
   * Get the first data object (useful when data is an array)
   * @returns The first data object or the data object if it's not an array
   */
  getFirstData(): TJsonapiResource<T> | undefined {
    if (!this._request.data) {
      return undefined;
    }
    return Array.isArray(this._request.data) 
      ? this._request.data[0] 
      : this._request.data;
  }

  /**
   * Get the data as an array (normalizes single objects to arrays)
   * @returns Array of data objects, empty array if no data
   */
  getDataAsArray(): TJsonapiResource<T>[] {
    if (!this._request.data) {
      return [];
    }
    return Array.isArray(this._request.data) 
      ? this._request.data 
      : [this._request.data];
  }

  /**
   * Get the type of the first data object
   * @returns The type string or undefined if no data
   */
  getType(): string | undefined {
    const firstData = this.getFirstData();
    return firstData?.type;
  }

  /**
   * Get the ID of the first data object
   * @returns The ID string or undefined if no data/ID
   */
  getId(): string | undefined {
    const firstData = this.getFirstData();
    return firstData?.id;
  }

  /**
   * Get the attributes from the first data object
   * @returns The attributes object or undefined if not present
   */
  getAttributes(): T | undefined {
    const firstData = this.getFirstData();
    return firstData?.attributes;
  }

  /**
   * Get a specific attribute value by key
   * @param key The attribute key to retrieve
   * @returns The attribute value or undefined if not found
   */
  getAttribute<K extends keyof T>(key: K): T[K] | undefined {
    const attributes = this.getAttributes();
    return attributes?.[key];
  }

  /**
   * Get a specific attribute value with a default fallback
   * @param key The attribute key to retrieve
   * @param defaultValue The default value to return if attribute is not found
   * @returns The attribute value or the default value
   */
  getAttributeOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): T[K] {
    const value = this.getAttribute(key);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Check if a specific attribute exists and has a truthy value
   * @param key The attribute key to check
   * @returns true if attribute exists and is truthy, false otherwise
   */
  hasAttribute<K extends keyof T>(key: K): boolean {
    const value = this.getAttribute(key);
    return !!value;
  }

  /**
   * Get the relationships from the first data object
   * @returns The relationships object or undefined if not present
   */
  getRelationships(): Record<string, unknown> | undefined {
    const firstData = this.getFirstData();
    return firstData?.relationships;
  }

  /**
   * Get a specific relationship by key
   * @param key The relationship key to retrieve
   * @returns The relationship object or undefined if not found
   */
  getRelationship(key: string): unknown {
    const relationships = this.getRelationships();
    return relationships?.[key];
  }

  /**
   * Get the data from a specific relationship
   * @param key The relationship key
   * @returns The relationship data or undefined if not found
   */
  getRelationshipData(key: string): unknown {
    const relationship = this.getRelationship(key);
    return (relationship as Record<string, unknown>)?.data;
  }

  /**
   * Get the meta object from the request
   * @returns The meta object or undefined if not present
   */
  getMeta(): Record<string, unknown> | undefined {
    return this._request.meta;
  }

  /**
   * Get a specific meta value by key
   * @param key The meta key to retrieve
   * @returns The meta value or undefined if not found
   */
  getMetaValue(key: string): unknown {
    const meta = this.getMeta();
    return meta?.[key];
  }

  /**
   * Get the included resources from the request
   * @returns Array of included resources or empty array if none
   */
  getIncluded(): TJsonapiResource[] {
    return this._request.included || [];
  }

  /**
   * Find an included resource by type and ID
   * @param type The resource type
   * @param id The resource ID
   * @returns The matching resource or undefined if not found
   */
  findIncluded(type: string, id: string): TJsonapiResource | undefined {
    return this.getIncluded().find(resource => 
      resource.type === type && resource.id === id
    );
  }

  /**
   * Find all included resources of a specific type
   * @param type The resource type
   * @returns Array of matching resources
   */
  findIncludedByType(type: string): TJsonapiResource[] {
    return this.getIncluded().filter(resource => resource.type === type);
  }

  /**
   * Validate that the request has required fields
   * @param requiredAttributes Array of required attribute keys
   * @returns Object with isValid boolean and missing fields array
   */
  validate(requiredAttributes: (keyof T)[] = []): { 
    isValid: boolean; 
    missing: string[] 
  } {
    const missing: string[] = [];

    if (!this.hasData()) {
      missing.push('data');
    }

    if (!this.getType()) {
      missing.push('data.type');
    }

    const attributes = this.getAttributes();
    if (!attributes && requiredAttributes.length > 0) {
      missing.push('data.attributes');
    } else if (attributes) {
      for (const key of requiredAttributes) {
        if (attributes[key] === undefined || attributes[key] === null) {
          missing.push(`data.attributes.${String(key)}`);
        }
      }
    }

    return {
      isValid: missing.length === 0,
      missing
    };
  }

  /**
   * Extract all attributes as a plain object, excluding undefined values
   * @returns Object with only defined attributes
   */
  getCleanAttributes(): Partial<T> {
    const attributes = this.getAttributes();
    if (!attributes) {
      return {};
    }

    const clean = {} as Partial<T>;
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        const value = attributes[key];
        if (value !== undefined && value !== null) {
          (clean as Record<string, unknown>)[key] = value;
        }
      }
    }
    return clean;
  }

  /**
   * Check if the request contains multiple data objects
   * @returns true if data is an array, false otherwise
   */
  isMultipleData(): boolean {
    return Array.isArray(this._request.data);
  }

  /**
   * Get the count of data objects in the request
   * @returns Number of data objects (0 if no data)
   */
  getDataCount(): number {
    if (!this._request.data) {
      return 0;
    }
    return Array.isArray(this._request.data) 
      ? this._request.data.length 
      : 1;
  }
}