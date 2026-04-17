import { request } from 'urllib'
import Config from '../../config'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  alertResponse as alert,
  alertState,
} from '../../state/dialog'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { COLLECTION_NAME } from '@tuber/shared'
import { log, log_err } from '../../utility/logging'

/**
 * Setup atlas search index for the bookmarks collection.  
 * TODO - Don't forget to set permission for this endpoint. `Dev` and above.
 */
export default async function post_bookmarks_api_setup_search_index_endpoint (
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const indexName = Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME
    const bookmarkSearchIndex = await find_index_by_name(indexName)

    if (!bookmarkSearchIndex) {
      const httpResponse = await request(Config.DB_ATLAS_SEARCH_INDEX_API_URL, {
        data: {
          database: Config.DB_NAME,
          collectionName: COLLECTION_NAME,
          name: indexName,
          // https://www.mongodb.com/docs/atlas/atlas-search/index-definitions/#sys
          mappings: {
            dynamic: true,
          },
        },
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        digestAuth: Config.DB_ATLAS_DIGEST_AUTH,
      })

      const message = `Search index '${indexName}' created successfully.`
      log('[DEBUG] Creating atlas bookmark search index... ')
      log('[DEBUG] http response:', httpResponse)

      return reply.code(201).send(
        JsonapiResponseBuilder.empty()
          .withMeta({
            status: 'created',
            indexName,
            collectionName: COLLECTION_NAME,
            atlasStatus: httpResponse.status ?? 201,
          })
          .withState(alertState(message))
          .build()
      )
    }

    const message = 'bookmark_search index already exists.'
    log(`[DEBUG] ${message}`)
    return reply.code(409).send({
      ...alert('bookmark_search index already exists!'),
      ...new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
        .withStatus(409)
        .withTitle(message)
        .withMeta('indexName', indexName)
        .withMeta('collectionName', COLLECTION_NAME)
        .build()
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    log_err(message, e)

    return reply.code(500).send({
      ...alert('Failed to create bookmark search index.'),
      ...new JsonapiErrorBuilder()
        .withCode('INTERNAL_ERROR')
        .withStatus(500)
        .withTitle('Failed to create bookmark search index.')
        .withDetail(message)
        .withMeta('indexName', Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME)
        .withMeta('collectionName', COLLECTION_NAME)
        .build()
    })
  }
}

async function find_index_by_name(indexName: string): Promise<unknown> {
  const allIndexesResponse = await request(
    `${Config.DB_ATLAS_SEARCH_INDEX_API_URL}/${Config.DB_NAME}/${COLLECTION_NAME}`,
    {
      dataType: 'json',
      contentType: 'application/json',
      method: 'GET',
      digestAuth: Config.DB_ATLAS_DIGEST_AUTH
    }
  )
  return (allIndexesResponse.data as any[]).find(i => i.name === indexName)
}
