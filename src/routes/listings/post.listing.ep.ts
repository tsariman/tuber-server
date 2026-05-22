import { FastifyReply, FastifyRequest } from 'fastify'
import {
  default_400_error_response,
  error_id
} from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { dbug, ler, log_err, task } from '../../utility/logging'
import { create_listing } from '../../model/listing'
import { IListingPost, IListing } from '../../schema/listing'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'

export default async function post_listing_endpoint (
  req: FastifyRequest<IListingPost>,
  reply: FastifyReply
) {
  try {
    const authenticatedUserId = req.usr?._id
    if (!authenticatedUserId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    const driver = new JsonapiRequestDriver(req.body)
    const attr = driver.getAttributes()
    task('Checking request data to create listing... ')
    if (!attr) {
      task.end('Failed.')
      reply.code(400).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'Invalid request data.'
      }))
      return
    }

    task(`Creating listing with name '${attr.name}'... `)
    
    // Validate required fields
    if (!attr.name) {
      task.end('Failed.')
      reply.code(400).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'Listing name is required.'
      }))
      return
    }

    // Handle JSON:API relationships -> IListing.bookmarks conversion
    const listingData: IListing = {
      ...attr,
      user_id: String(authenticatedUserId)
    }
    
    // Get bookmark relationships from the request
    const bookmarkRelationshipData = driver.getRelationshipData('bookmarks')
    
    if (bookmarkRelationshipData) {
      // Handle both single resource linkage and arrays
      const bookmarkRelationships = Array.isArray(bookmarkRelationshipData) 
        ? bookmarkRelationshipData 
        : [bookmarkRelationshipData]
      
      task(`Converting ${bookmarkRelationships.length} bookmark relationships...`)
      
      // Convert JSON:API bookmark relationships to IListing.bookmarks format
      listingData.bookmarks = bookmarkRelationships.map((bookmarkRef) => {
        // Find the full bookmark data in the included section
        const includedBookmark = driver.findIncluded('bookmarks', bookmarkRef.id)
        
        return {
          is_active: true,
          is_private: false,
          created_at: new Date(),
          bookmark_id: bookmarkRef.id,
          // Extract html_tag from included bookmark attributes if available
          html_tag: includedBookmark?.attributes?.html_tag as string | undefined
        }
      })
      
      dbug(`Converted ${listingData.bookmarks.length} bookmark relationships.`)
    }

    const dbListing = await create_listing(listingData)
    task.end('Done.')
    task('Sending response...')
    task.end(dbListing)
    
    // Separate _id from attributes for JSON:API format
    const { _id, ...listingAttributes } = dbListing.toObject()
    
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(listingAttributes, 'listings')
        .withId(_id)
        .build()
    )
  } catch (e) {
    // Handle duplicate name error (MongoDB duplicate key error)
    if (e && typeof e === 'object' && 'code' in e && e.code === 11000) {
      task.end('Failed.')
      reply.code(409).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'A listing with this name already exists.'
      }))
      return
    }

    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50036]'))
    log_err('[50036] POST listing', e)
    reply.code(500).send(error_id(50036).default_500_error_response(e))
  }
}