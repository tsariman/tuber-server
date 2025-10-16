import { FastifyReply, FastifyRequest } from 'fastify';
import { PipelineStage, Types } from 'mongoose';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder';
import Config from '../config';
import {
  BookmarkModel,
  read_bookmark_collection
} from '../model/bookmark';
import { IBookmarkDocument, IBookmarkGet } from '../schema/bookmarks';
import { DB_PAGINATION_QUERY, MSG_500_ERROR_MESSAGE } from '../constants.server';
import { get_raw_query } from './_endpoint.common.logic';
import { log, write as print, log_err, ler } from '../utility/logging';

export default async function get_bookmark_collection_endpoint (
  req: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    const searchQuery = req.query.filter?.search;
    const page = req.query.page?.number ?? 1;
    const limit = req.query.page?.size ?? parseInt(Config.PAGINATION_BOOKMARKS_LIMIT);
    if (searchQuery) {
      const pipeline: PipelineStage[] = [];
      pipeline.push({
        $search: {
          index: Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
          text: {
            query: searchQuery,
            path: [ 'title', 'note' ],
            fuzzy: {}
          },
        },
      });
      pipeline.push({
        $match: {
          // is_active: true // Filter documents where the is_active field is true
          ...DB_PAGINATION_QUERY,
          is_published: { $ne: false }
        }
      });
      pipeline.push({
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          results: { $push: '$$ROOT' } // Store the matched documents in an
                                       // array
        }
      });
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
      });
      const aggregationResult = await BookmarkModel.aggregate(pipeline);
      if (!aggregationResult[0]) {
        // [TODO] Remove this error reporting. An undefined aggregate result
        //        most likely means there are no document matching the query.
        log('[DEBUG] Query did not return any result. '
          + '(aggregationResult[0] is undefined)');
        reply.code(404).send(new JsonapiErrorBuilder()
          .withCode('not_found')
          .withStatus(404)
          .withTitle('The aggregate result array first object is undefined.')
          .withDetail('Either the query is faulty or the aggregate pipeline failed '
            +'Or there are no bookmarks that match the query')
          .withSource({ 'parameter': 'query' })
          .withErrorMeta('query', searchQuery)
          .build()
        );
        return;
      }
      const { totalItems, results } = aggregationResult[0];
      if (aggregationResult.length > 0) {
        const filter = `filter[search]=${encodeURIComponent(searchQuery)}`;
        
        // Convert results to JSON:API resources
        const resources = results.map((bookmark: IBookmarkDocument<Types.ObjectId>) => ({
          type: 'bookmarks',
          id: bookmark._id?.toString() ?? '',
          attributes: {
            author: bookmark.author,
            embed_url: bookmark.embed_url,
            slug: bookmark.slug,
            rating: bookmark.rating,
            targeted_audience: bookmark.targeted_audience,
            play_count: bookmark.play_count,
            videoid: bookmark.videoid,
            platform: bookmark.platform,
            start_seconds: bookmark.start_seconds,
            end_seconds: bookmark.end_seconds,
            title: bookmark.title,
            note: bookmark.note,
            upvotes: bookmark.upvotes,
            downvotes: bookmark.downvotes,
            url: bookmark.url,
            thumbnail_url: bookmark.thumbnail_url,
            restrict: bookmark.restrict,
            rules: bookmark.rules,
            created_at: bookmark.created_at,
            modified_at: bookmark.modified_at,
            user_id: bookmark.user_id,
            is_active: bookmark.is_active,
          }
        }));

        reply.code(200).send(
          JsonapiResponseBuilder.forCollection()
            .withCollection(resources)
            .withCollectionPagination(totalItems, page, limit, filter)
            .withMeta({
              max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES,
              search: get_raw_query(req)
            })
            .buildCollection()
        );
      } else {
        reply.status(200).send({
          data: [],
          currentPage: page,
          totalPages: 0,
          totalItems: 0
        });
      }
    } else {
      log('[DEBUG] Running search query:', searchQuery);
      print(`[DEBUG] Getting bookmarks collection (page ${page}, limit ${limit})... `);
      const result = await read_bookmark_collection(page, limit);
      log('Done.');
      
      // Convert mongoose documents to JSON:API resources
      const resources = result.docs.map((bookmark) => ({
        type: 'bookmarks',
        id: bookmark._id.toString(),
        attributes: {
          author: bookmark.author,
          embed_url: bookmark.embed_url,
          slug: bookmark.slug,
          rating: bookmark.rating,
          targeted_audience: bookmark.targeted_audience,
          play_count: bookmark.play_count,
          videoid: bookmark.videoid,
          platform: bookmark.platform,
          start_seconds: bookmark.start_seconds,
          end_seconds: bookmark.end_seconds,
          title: bookmark.title,
          note: bookmark.note,
          upvotes: bookmark.upvotes,
          downvotes: bookmark.downvotes,
          url: bookmark.url,
          thumbnail_url: bookmark.thumbnail_url,
          restrict: bookmark.restrict,
          rules: bookmark.rules,
          created_at: bookmark.created_at,
          modified_at: bookmark.modified_at,
          user_id: bookmark.user_id,
          is_active: bookmark.is_active
        }
      }));

      reply.code(200).send(
        JsonapiResponseBuilder.forCollection()
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
          .buildCollection()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('GET bookmark collection', e);
    reply.code(500).send(default_500_error_response(e));
  }
}