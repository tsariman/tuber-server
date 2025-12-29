import { FastifyReply, FastifyRequest } from 'fastify'
import { error_id } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import Config from '../../config'
import {
  BookmarkModel,
  read_bookmark_collection,
  to_jsonapi_bookmark_resources
} from '../../model/bookmark'
import { IBookmark, IBookmarkDocument, IBookmarkGet } from '../../schema/bookmark'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { get_raw_query } from './_bookmarks.common.logic'
import { log_err, ler, dbug } from '../../utility/logging'
import get_bookmark_search_query_pipeline from '../../model/bookmark/get.bookmark.search.query.pipeline'
import { BookmarkVoteModel } from '../../model/bookmark.vote'

/** `GET /dev/bookmarks` */
export default async function get_bookmark_collection_endpoint (
  req: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    const searchQuery = req.query.filter?.search
    dbug('req.query =', req.query)
    const page = Math.max(1, req.query.page?.number ?? 1)
    const limit = Math.max(1, Math.min(100, req.query.page?.size ?? parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)))
    
    // bookmarkVotes will be populated after bookmarks are fetched from dedicated collection
    let bookmarkVotes: Map<string, { rating: 1 | -1; bookmark_id: string }> | undefined
    
    if (searchQuery) {
      dbug('Running search query:', searchQuery)
      dbug(`Getting bookmarks collection with search (page ${page}, limit ${limit}) `)
      const pipeline = get_bookmark_search_query_pipeline({
        searchQuery,
        page,
        limit
      }, req.usr)
      const aggregationResult = await BookmarkModel.aggregate(pipeline)

      // Handle empty results - return 200 with empty data
      const { totalItems = 0, results = [] } = aggregationResult[0] || {}
      
      const filter = `filter[search]=${encodeURIComponent(searchQuery)}`
      
      // Build user votes map for current user limited to fetched bookmarks
      if (req.usr?._id) {
        const bookmarkIds = results.map((b: IBookmarkDocument) => b._id)
        const votes = await BookmarkVoteModel.find({ user_id: String(req.usr._id), bookmark_id: { $in: bookmarkIds.map((id: unknown) => String(id)) } }, { bookmark_id: 1, rating: 1 })
        bookmarkVotes = new Map(votes.map(v => [v.bookmark_id, { rating: v.rating as 1 | -1, bookmark_id: v.bookmark_id }]))
      }
      // Convert results to JSON:API resources with user votes
      const { resources, included } = to_jsonapi_bookmark_resources(results, bookmarkVotes)

      const builder = JsonapiResponseBuilder.forCollection<IBookmark>()
        .withCollection(resources)
        .withCollectionPagination(totalItems, page, limit, filter)
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
      dbug(`Getting bookmarks collection (page ${page}, limit ${limit}) `)
      const result = await read_bookmark_collection(page, limit)
      
      // Build user votes map for current user limited to fetched bookmarks
      if (req.usr?._id) {
        const bookmarkIds = result.docs.map((b: IBookmarkDocument) => b._id)
        const votes = await BookmarkVoteModel.find({ user_id: String(req.usr._id), bookmark_id: { $in: bookmarkIds.map((id: unknown) => String(id)) } }, { bookmark_id: 1, rating: 1 })
        bookmarkVotes = new Map(votes.map(v => [v.bookmark_id, { rating: v.rating as 1 | -1, bookmark_id: v.bookmark_id }]))
      }
      // Convert mongoose documents to JSON:API resources with user votes
      const { resources, included } = to_jsonapi_bookmark_resources(result.docs, bookmarkVotes)

      const builder = JsonapiResponseBuilder.forCollection<IBookmark>()
        .withCollection(resources)
        .withPaginationLinks({
          totalDocs: result.totalDocs,
          limit: result.limit,
          page: result.page,
          totalPages: result.totalPages,
          nextPage: result.nextPage,
          hasNextPage: result.hasNextPage,
          prevPage: result.prevPage,
          hasPrevPage: result.hasPrevPage,
          pagingCounter: result.pagingCounter
        })
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
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5011]'))
    log_err('[5011] GET bookmark collection error', e)
    reply.code(500).send(error_id(5011).default_500_error_response(e))
  }
}