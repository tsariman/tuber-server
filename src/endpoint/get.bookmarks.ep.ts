import { FastifyReply } from 'fastify'
import { PipelineStage } from 'mongoose'
import { get_query } from '../business.logic'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import Config from '../config'
import {
  BookmarkModel,
  get_bookmark_collection
} from '../model/bookmark'
import { TBookmarkGetFastifyRequest } from '../schema/bookmarks'
import { DB_PAGINATION_QUERY, MSG_500_ERROR_MESSAGE } from '../constants'

export default async function get_bookmarks_collection_endpoint (
  req: TBookmarkGetFastifyRequest,
  reply: FastifyReply
) {
  try {
    const searchQuery = get_query(req, 'filter[search]')
    const page = parseInt(get_query(req, 'page[number]', '1'))
    const limit = parseInt(get_query(
      req,
      'page[size]',
      Config.PAGINATION_BOOKMARKS_LIMIT
    ))
    if (searchQuery) {
      const pipeline: PipelineStage[] = []
      pipeline.push({
        $search: {
          index: Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
          text: {
            query: searchQuery,
            path: [ 'title', 'note' ],
            fuzzy: {}
          },
        },
      })
      pipeline.push({
        $match: {
          // is_active: true // Filter documents where the is_active field is true
          ...DB_PAGINATION_QUERY
        }
      })
      pipeline.push({
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          results: { $push: '$$ROOT' } // Store the matched documents in an
                                       // array
        }
      })
      pipeline.push({
        $project: {
          _id: 1,
          is_active: 1,
          created_at: 1,
          modified_at: 1,
          user_id: 1,
          videoid: 1,
          platform: 1,
          start_seconds: 1,
          end_seconds: 1,
          title: 1,
          note: 1,
          upvotes: 1,
          downvotes: 1,
          url: 1,
          thumbnail_url: 1,
          restrictions: 1,
          rules: 1,
          results: {
            $slice: ['$results', (page - 1) * limit, limit]
          },
          score: { $meta: 'searchScore' },
          totalItems: 1,
        }
      })
      const aggregationResult = await BookmarkModel.aggregate(pipeline)
      if (!aggregationResult[0]) {
        // [TODO] Remove this error reporting. An undefined aggregate result
        //        most likely means there are no document matching the query.
        Config.log('aggregationResult[0] is undefined')
        reply.code(404).send(new JsonapiErrorBuilder()
          .code('not_found')
          .status(404)
          .title('The aggregate result array first object is undefined.')
          .detail('Either the query is faulty or the aggregate pipeline failed '
            +'Or there are no bookmarks that match the query')
          .source({ 'parameter': 'query' })
          .errorMeta('query', searchQuery)
          .build()
        )
        return
      }
      const { totalItems, results } = aggregationResult[0]
      if (aggregationResult.length > 0) {
        const filter = `?filter[search]=${searchQuery}&`
        reply.code(200).send(new JsonapiResponseBuilder(
            results,
            'bookmarks',
            'collection'
          )
          .meta('max_loaded_pages', Config.MAX_LOADED_BOOKMARK_PAGES)
          .buildLinks({ docs: results, filter, page, limit, totalDocs: totalItems })
          .build()
        )
      } else {
        reply.status(200).send({
          data: [],
          currentPage: page,
          totalPages: 0,
          totalItems: 0
        })
      }
    } else {
      Config.log('Running search query:', searchQuery)
      Config.print(`Getting bookmarks collection (page ${page}, limit ${limit})... `)
      const result = await get_bookmark_collection(page, limit)
      Config.log('Done.')
      const bookmarkDocs = result.docs
      reply.code(200).send(
        new JsonapiResponseBuilder(bookmarkDocs, 'bookmarks', 'collection')
          .meta('max_loaded_pages', Config.MAX_LOADED_BOOKMARK_PAGES)
          .buildPaginationV2Links(result)
          .mPaginationV2build()
      )
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}