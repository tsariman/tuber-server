import { bracketize_object_querystring } from '.'
import { IJsonapiPaginationLinks } from '../../../tuber-client/src/controllers/interfaces/IJsonapi'

export interface IPaginatedResult<T> {
  docs: T
  totalDocs: number
  limit: number
  page?: number
  totalPages: number
  nextPage?: number | null
  hasNextPage: boolean
  prevPage?: number | null
  hasPrevPage: boolean
  pagingCounter: number
}

/*
example:
{
  "links": {
    "self": "?page[number]=3&page[size]=1",
    "first": "?page[number]=1&page[size]=1",
    "prev": "?page[number]=2&page[size]=1",
    "next": "?page[number]=4&page[size]=1",
    "last": "?page[number]=13&page[size]=1"
    },
}
*/

/**
 * @see https://jsonapi.org/format/#fetching-pagination
 */
export default class JsonapiResponsePaginationBuilder<T=any> {

  private links: IJsonapiPaginationLinks
  private options: IPaginatedResult<T>

  constructor(opts: IPaginatedResult<T>) {
    this.options = opts
    this.links = { self: '' }
  }

  build(): IJsonapiPaginationLinks {
    this.links.self = this.selfLink()
    this.links.first = this.firstLink()
    this.links.last = this.lastLink()
    this.links.prev = this.prevLink()
    this.links.next = this.nextLink()
    return this.links
  }

  private getSize(): number {
    return this.options.limit > this.options.totalDocs
      ? this.options.totalDocs
      : this.options.limit
  }

  private selfLink(): string {
    const selfObj = {
      page: {
        number: this.options.page,
        size: this.getSize()
      }
    }
    const str = bracketize_object_querystring(selfObj)
    return str.substring(0, str.length - 1)
  }

  private firstLink(): string {
    const firstObj = {
      page: {
        number: 1,
        size: this.getSize()
      }
    }
    const str = bracketize_object_querystring(firstObj)
    return str.substring(0, str.length - 1)
  }

  private lastLink(): string {
    const lastObj = {
      page: {
        number: this.options.totalPages,
        size: this.getSize()
      }
    }
    const str = bracketize_object_querystring(lastObj)
    return str.substring(0, str.length - 1)
  }

  private prevLink(): string {
    const prevObj = {
      page: {
        number: this.options.prevPage,
        size: this.getSize()
      }
    }
    const str = bracketize_object_querystring(prevObj)
    return str.substring(0, str.length - 1)
  }

  private nextLink(): string {
    const nextObj = {
      page: {
        number: this.options.nextPage,
        size: this.getSize()
      }
    }
    const str = bracketize_object_querystring(nextObj)
    return str.substring(0, str.length - 1)
  }

}
