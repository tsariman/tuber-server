import { request } from 'urllib'
import Config from '../config'
import { FastifyReply, FastifyRequest } from 'fastify'
import { defaultDialogAlertState as alert } from '../state/dialogs'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'

const COLLECTION_NAME = 'annotations'

/**
 * Setup atlas search index for the annotations collection.  
 * [TODO] Don't forget to set permission for this endpoint. `Dev` and above.
 */
export default async function annotations_api_setup_search_index_endpoint (
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const annotationSearchIndex = await find_index_by_name('annotation_search')
  if (!annotationSearchIndex) {
    Config.print('Creating atlas annotation search index... ')
    const httpResponse = await request(Config.DB_ATLAS_SEARCH_INDEX_API_URL, {
      data: {
        database: Config.DB_NAME,
        collectionName: COLLECTION_NAME,
        name: 'annotation_search',
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
    Config.log('done.')
    Config.log('http response:', httpResponse)
  } else {
    const message = 'annotation_search index already exist.'
    Config.log(message)
    reply.code(409).send({
      ...alert('annotation_search index already exist!'),
      ...new JsonapiErrorBuilder()
        .code('conflict')
        .status(409)
        .title(message)
        .build()
    })
  }
}

async function find_index_by_name(indexName: string) {
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
