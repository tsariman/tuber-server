import { TJsonapiPaginationLinks } from '../common.types'
import { bracketize_object_querystring } from '.'

export interface IPaginatedResult {
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

export type TpaginatedResultOptional = Partial<IPaginatedResult>

export interface IMinimalPaginationOptions<T=any> {
  docs?: T
  page?: number
  limit?: number
  totalDocs?: number
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
export default class JsonapiResponsePaginationBuilder {

  private links: TJsonapiPaginationLinks
  private options: IPaginatedResult

  constructor(opts: IPaginatedResult) {
    this.options = opts
    this.links = { self: '' }
  }

  setOptions = ({
    docs = [],
    page = 1,
    limit = 10,
    totalDocs = 0
  }: IMinimalPaginationOptions) => {
    const totalPages = Math.ceil(totalDocs / limit) || 1
    const nextPage = page < totalPages ? page + 1 : null
    const hasNextPage = page < totalPages
    const prevPage = page > 1 ? page - 1 : null
    const hasPrevPage = page > 1
    const pagingCounter = ((page - 1) * page) + 1
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
    }
  }

  build(): TJsonapiPaginationLinks {
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

/** Get pagination options based on page, total docs, limit... etc. */
export function get_pagination_options({
  page = 1,
  limit = 10,
  totalDocs = 0
}: IMinimalPaginationOptions): IPaginatedResult {
  const totalPages = Math.ceil(totalDocs / limit) || 1
  const nextPage = page < totalPages ? page + 1 : null
  const hasNextPage = page < totalPages
  const prevPage = page > 1 ? page - 1 : null
  const hasPrevPage = page > 1
  const pagingCounter = ((page - 1) * page) + 1
  return {
    totalDocs,
    limit,
    page,
    totalPages,
    nextPage,
    hasNextPage,
    prevPage,
    hasPrevPage,
    pagingCounter
  }
}

/*
docs: results,
totalDocs,
limit,
page,
totalPages: (Math.ceil(totalDocs / limit)) || 1,
nextPage: page < ((Math.ceil(totalDocs / limit)) || 1) ? page + 1 : null,
hasNextPage: page < ((Math.ceil(totalDocs / limit)) || 1),
prevPage: page > 1 ? page - 1 : null,
hasPrevPage: page > 1,
pagingCounter: ((page - 1) * page) + 1,
*/