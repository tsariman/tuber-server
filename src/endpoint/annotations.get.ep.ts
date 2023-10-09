import { FastifyReply } from 'fastify'
import { PipelineStage } from 'mongoose'
import { get_query } from 'src/business.logic'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import Config from 'src/config'
import {
  AnnotationModel,
  get_annotation_collection
} from 'src/model/annotation'
import { TAnnotationGetFastifyRequest } from 'src/schema/annotations'

export default async function annotations_get_collection_endpoint (
  req: TAnnotationGetFastifyRequest,
  reply: FastifyReply
) {
  try {
    const searchQuery = get_query(req, 'query')
    const page = parseInt(get_query(req, 'page[number]', '1'))
    const limit = parseInt(get_query(
      req,
      'page[size]',
      Config.PAGINATION_ANNOTATIONS_LIMIT
    ))
    if (searchQuery) {
      const pipeline: PipelineStage[] = []
      pipeline.push({
        $search: {
          index: Config.DB_ATLAS_ANNOTATION_SEARCH_INDEX_NAME,
          text: {
            query: searchQuery,
            path: ['title', 'note' ],
            fuzzy: {}
          },
        },
      })
      pipeline.push({
        $match: {
          // is_active: true // Filter documents where the is_active field is true
          ...Config.DB_PAGINATION_QUERY
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
          restrictions: 1,
          rules: 1,
          results: {
            $slice: ['$results', (page - 1) * limit, limit]
          },
          score: { $meta: 'searchScore' },
          totalItems: 1,
        }
      })
      const aggregationResult = await AnnotationModel.aggregate(pipeline)
      const { totalItems, results } = aggregationResult[0]
      if (aggregationResult.length > 0) {
        reply.code(200).send(new JsonapiResponseBuilder(
            results,
            'annotations',
            'collection'
          )
          .meta('max_loaded_pages', Config.MAX_LOADED_ANNOTATION_PAGES)
          .buildLinks({ docs: results, page, limit, totalDocs: totalItems })
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
      Config.print(`Getting annotations collection (page ${page}, limit ${limit})... `)
      const result = await get_annotation_collection(page, limit)
      Config.log('done.')
      const annotationDocs = result.docs
      reply.code(200).send(
        new JsonapiResponseBuilder(annotationDocs, 'annotations', 'collection')
          .meta('max_loaded_pages', Config.MAX_LOADED_ANNOTATION_PAGES)
          .buildPaginationV2Links(result)
          .mPaginationV2build()
      )
    }
  } catch (e: any) {
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}