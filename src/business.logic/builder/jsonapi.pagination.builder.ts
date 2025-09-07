import { TJsonapiPaginationLinks } from '../../shared';
import { bracketize_object_querystring } from '..';

export interface IPaginatedResult {
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  hasNextPage: boolean;
  prevPage?: number | null;
  hasPrevPage: boolean;
  pagingCounter: number;
  filter?: string;
}

export type TpaginatedResultOptional = Partial<IPaginatedResult>;

export interface IMinimalPaginationOptions<T=unknown> {
  docs?: T;
  page?: number;
  limit?: number;
  totalDocs?: number;
  filter?: string;
}

/**
 * @see https://jsonapi.org/format/#fetching-pagination
 */
export default class JsonapiPaginationBuilder {

  private _links: TJsonapiPaginationLinks;
  private _opts: IPaginatedResult;

  constructor(opts: IPaginatedResult) {
    this._opts = opts;
    this._links = { self: '' };
  }

  setOptions = ({
    docs = [],
    page = 1,
    limit = 10,
    totalDocs = 0
  }: IMinimalPaginationOptions) => {
    if (limit <= 0) throw new Error('Limit must be greater than 0');
    
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const nextPage = page < totalPages ? page + 1 : null;
    const hasNextPage = page < totalPages;
    const prevPage = page > 1 ? page - 1 : null;
    const hasPrevPage = page > 1;
    const pagingCounter = ((page - 1) * limit) + 1; // Fixed: was ((page - 1) * page) + 1
    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      nextPage,
      hasNextPage,
      prevPage,
      hasPrevPage,
      pagingCounter
    };
  }

  build(): TJsonapiPaginationLinks {
    this._links.self = this.selfLink();
    this._links.first = this.firstLink();
    this._links.last = this.lastLink();
    
    const prevLink = this.prevLink();
    if (prevLink) {
      this._links.prev = prevLink;
    }
    
    const nextLink = this.nextLink();
    if (nextLink) {
      this._links.next = nextLink;
    }
    
    return this._links;
  }

  private getSize(): number {
    return this._opts.limit > this._opts.totalDocs
      ? this._opts.totalDocs
      : this._opts.limit;
  }

  private selfLink(): string {
    const selfObj = {
      page: {
        number: this._opts.page,
        size: this.getSize()
      }
    };
    let result = bracketize_object_querystring(selfObj);
    
    // Add filter if it exists
    if (this._opts.filter) {
      const separator = result.includes('?') ? '&' : '?';
      result += `${separator}${this._opts.filter}`;
    }
    
    return result;
  }

  private firstLink(): string {
    const firstObj = {
      page: {
        number: 1,
        size: this.getSize()
      }
    };
    let result = bracketize_object_querystring(firstObj);
    
    // Add filter if it exists
    if (this._opts.filter) {
      const separator = result.includes('?') ? '&' : '?';
      result += `${separator}${this._opts.filter}`;
    }
    
    return result;
  }

  private lastLink(): string {
    const lastObj = {
      page: {
        number: this._opts.totalPages,
        size: this.getSize()
      }
    };
    let result = bracketize_object_querystring(lastObj);
    
    // Add filter if it exists
    if (this._opts.filter) {
      const separator = result.includes('?') ? '&' : '?';
      result += `${separator}${this._opts.filter}`;
    }
    
    return result;
  }

  private prevLink(): string | undefined {
    if (!this._opts.hasPrevPage || !this._opts.prevPage) {
      return undefined;
    }
    
    const prevObj = {
      page: {
        number: this._opts.prevPage,
        size: this.getSize()
      }
    };
    let result = bracketize_object_querystring(prevObj);
    
    // Add filter if it exists
    if (this._opts.filter) {
      const separator = result.includes('?') ? '&' : '?';
      result += `${separator}${this._opts.filter}`;
    }
    
    return result;
  }

  private nextLink(): string | undefined {
    if (!this._opts.hasNextPage || !this._opts.nextPage) {
      return undefined;
    }
    
    const nextObj = {
      page: {
        number: this._opts.nextPage,
        size: this.getSize()
      }
    };
    let result = bracketize_object_querystring(nextObj);
    
    // Add filter if it exists
    if (this._opts.filter) {
      const separator = result.includes('?') ? '&' : '?';
      result += `${separator}${this._opts.filter}`;
    }
    
    return result;
  }

}

/** Get pagination options based on page, total docs, limit... etc. */
export function get_pagination_options({
  page = 1,
  limit = 10,
  totalDocs = 0,
  filter = ''
}: IMinimalPaginationOptions): IPaginatedResult {
  if (limit <= 0) throw new Error('Limit must be greater than 0');
  if (page < 1) throw new Error('Page must be greater than 0');
  
  const totalPages = Math.ceil(totalDocs / limit) || 1;
  const nextPage = page < totalPages ? page + 1 : null;
  const hasNextPage = page < totalPages;
  const prevPage = page > 1 ? page - 1 : null;
  const hasPrevPage = page > 1;
  const pagingCounter = ((page - 1) * limit) + 1; // Fixed: was ((page - 1) * page) + 1
  return {
    totalDocs,
    limit,
    page,
    totalPages,
    nextPage,
    hasNextPage,
    prevPage,
    hasPrevPage,
    pagingCounter,
    filter
  };
}
