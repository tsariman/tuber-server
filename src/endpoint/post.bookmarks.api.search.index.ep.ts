import { request } from 'urllib';
import Config from '../config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { defaultDialogAlertState as alert } from '../state/dialog';
import JsonapiErrorBuilder from '../business.logic/builder/jsonapi.error.builder';
import { COLLECTION_NAME } from 'src/constants';

/**
 * Setup atlas search index for the bookmarks collection.  
 * [TODO] Don't forget to set permission for this endpoint. `Dev` and above.
 */
export default async function post_bookmarks_api_setup_search_index_endpoint (
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const bookmarkSearchIndex = await find_index_by_name(
      Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME
    );
    if (!bookmarkSearchIndex) {
      const httpResponse = await request(Config.DB_ATLAS_SEARCH_INDEX_API_URL, {
        data: {
          database: Config.DB_NAME,
          collectionName: COLLECTION_NAME,
          name: Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
          // https://www.mongodb.com/docs/atlas/atlas-search/index-definitions/#sys
          mappings: {
            dynamic: true,
          },
        },
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        digestAuth: Config.DB_ATLAS_DIGEST_AUTH,
      });
      Config.log('[DEBUG] Creating atlas bookmark search index... ');
      Config.log('[DEBUG] http response:', httpResponse);
    } else {
      const message = 'bookmark_search index already exist.';
      Config.log(`[DEBUG] ${message}`);
      reply.code(409).send({
        ...alert('bookmark_search index already exist!'),
        ...new JsonapiErrorBuilder()
          .code('conflict')
          .status(409)
          .title(message)
          .build()
      });
    }

  } catch (e: unknown) {
    (e as Error).message;
  }
}

async function find_index_by_name(indexName: string): Promise<any> {
  const allIndexesResponse = await request(
    `${Config.DB_ATLAS_SEARCH_INDEX_API_URL}/${Config.DB_NAME}/${COLLECTION_NAME}`,
    {
      dataType: 'json',
      contentType: 'application/json',
      method: 'GET',
      digestAuth: Config.DB_ATLAS_DIGEST_AUTH
    }
  );
  return (allIndexesResponse.data as any[]).find(i => i.name === indexName);
}
