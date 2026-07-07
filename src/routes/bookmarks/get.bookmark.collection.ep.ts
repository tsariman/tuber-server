import { FastifyReply, FastifyRequest } from 'fastify'
import { error_id } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import Config from '../../config'
import {
  to_jsonapi_bookmark_resources
} from '../../model/bookmark'
import { IBookmark, IBookmarkGet } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { get_raw_query } from './_bookmarks.common.logic'
import { log_err, ler, dbug } from '../../utility/logging'
import { TSearchMode } from '../../common.types'
import {
  read_bookmark_collection_by_query,
  read_bookmark_votes_for_user
} from '../../model/bookmark/read.bookmark.collection.by.query'

const VALID_SEARCH_MODE: TSearchMode[] = ['public', 'private', 'all']

const to_valid_search_mode = (mode?: string): TSearchMode | undefined => {
  if (!mode) {
    return undefined
  }
  if (VALID_SEARCH_MODE.includes(mode as TSearchMode)) {
    return mode as TSearchMode
  }
  return undefined
}

/** `GET /bookmarks` endpoint handler */
export default async function get_bookmark_collection_endpoint (
  req: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    const searchQuery = req.query.filter?.search?.trim()
    const searchMode = to_valid_search_mode(
      req.query.filter?.search_mode || req.query.filter?.mode
    )
    dbug('req.query =', req.query)
    const requestedPage = req.query.page?.number
    const requestedLimit = req.query.page?.size
    
    if (searchQuery) {
      dbug('Running search query:', searchQuery)
      dbug(`Getting bookmarks collection with search (page ${requestedPage ?? 1}, limit ${requestedLimit ?? parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)}) `)

      const collection = await read_bookmark_collection_by_query({
        searchQuery,
        searchMode,
        page: requestedPage,
        limit: requestedLimit,
        usr: req.usr
      })
      const bookmarkVotes = await read_bookmark_votes_for_user(req.usr, collection.docs)

      // Convert results to JSON:API resources with user votes
      const { resources, included } = to_jsonapi_bookmark_resources(collection.docs, bookmarkVotes)

      const builder = JsonapiResponseBuilder.forCollection<IBookmark>()
        .withCollection(resources)
        .withCollectionPagination(
          collection.totalItems,
          collection.page,
          collection.limit,
          collection.filter
        )
        .withMeta({
          max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES,
          search: get_raw_query(req)
        })
      
      // Add included documents if there are any user votes
      if (included.length > 0) {
        builder.withIncluded(included)
      }

      reply.code(200).send(builder.buildCollection())
    } else {
      dbug(`Getting bookmarks collection (page ${requestedPage ?? 1}, limit ${requestedLimit ?? parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)}) `)
      const collection = await read_bookmark_collection_by_query({
        searchMode,
        page: requestedPage,
        limit: requestedLimit,
        usr: req.usr
      })
      const bookmarkVotes = await read_bookmark_votes_for_user(req.usr, collection.docs)

      // Convert mongoose documents to JSON:API resources with user votes
      const { resources, included } = to_jsonapi_bookmark_resources(collection.docs, bookmarkVotes)

      const builder = JsonapiResponseBuilder.forCollection<IBookmark>()
        .withCollection(resources)
        .withCollectionPagination(
          collection.totalItems,
          collection.page,
          collection.limit
        )
        .withMeta({
          max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES
        })
      
      // Add included documents if there are any user votes
      if (included.length > 0) {
        builder.withIncluded(included)
      }

      reply.code(200).send(builder.buildCollection())
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50011]'))
    log_err('[50011] GET bookmark collection error', e)
    reply.code(500).send(error_id(50011).default_500_error_response(e))
  }
}