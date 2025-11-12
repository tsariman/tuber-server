import { FastifyReply, FastifyRequest } from 'fastify';
import { default_500_error_response } from '../business.logic/errors';
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder';
import Config from '../config';
import {
  BookmarkModel,
  read_bookmark_collection,
  to_jsonapi_bookmark_resources
} from '../model/bookmark';
import { IBookmark, IBookmarkGet } from '../schema/bookmarks';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import { get_raw_query } from './_handlers.common.logic';
import { log, write as print, log_err, ler } from '../utility/logging';
import get_bookmark_search_query_pipeline from '../model/bookmark/get.bookmark.search.query.pipeline';

export default async function get_bookmark_collection_endpoint (
  req: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    const searchQuery = req.query.filter?.search;
    const page = Math.max(1, req.query.page?.number ?? 1);
    const limit = Math.max(1, Math.min(100, req.query.page?.size ?? parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)));
    if (searchQuery) {
      log('[DEBUG] Running search query:', searchQuery);
      print(`[DEBUG] Getting bookmarks collection with search (page ${page}, limit ${limit})... `);
      const pipeline = get_bookmark_search_query_pipeline({
        searchQuery,
        page,
        limit
      }, req.usr);
      const aggregationResult = await BookmarkModel.aggregate(pipeline);
      log('Done.');

      // Handle empty results - return 200 with empty data
      const { totalItems = 0, results = [] } = aggregationResult[0] || {};
      
      const filter = `filter[search]=${encodeURIComponent(searchQuery)}`;
      
      // Convert results to JSON:API resources
      const resources = to_jsonapi_bookmark_resources(results);

      reply.code(200).send(
        JsonapiResponseBuilder.forCollection<IBookmark>()
          .withCollection(resources)
          .withCollectionPagination(totalItems, page, limit, filter)
          .withMeta({
            max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES,
            search: get_raw_query(req)
          })
          .buildCollection()
      );
    } else {
      print(`[DEBUG] Getting bookmarks collection (page ${page}, limit ${limit})... `);
      const result = await read_bookmark_collection(page, limit);
      log('Done.');
      
      // Convert mongoose documents to JSON:API resources
      const resources = to_jsonapi_bookmark_resources(result.docs);

      reply.code(200).send(
        JsonapiResponseBuilder.forCollection<IBookmark>()
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