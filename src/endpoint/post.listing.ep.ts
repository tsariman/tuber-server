import { MongoServerError } from 'mongodb';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  default_500_error_response,
  default_400_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder';
import { ler, log, log_err, write as print } from '../utility/logging';
import { create_listing } from '../model/listing';
import { IListingPost, IListing } from '../schema/listings';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';
import JsonapiRequestDriver from '../business.logic/jsonapi.request.driver';

export default async function post_listing_endpoint (
  req: FastifyRequest<IListingPost>,
  reply: FastifyReply
) {
  try {
    const driver = new JsonapiRequestDriver(req.body);
    const attr = driver.getAttributes();
    
    if (!attr) {
      log('Failed.');
      reply.code(400).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'Invalid request data.'
      }));
      return;
    }

    print(`[DEBUG] Creating listing with name '${attr.name}'... `);
    
    // Validate required fields
    if (!attr.name) {
      log('Failed.');
      reply.code(400).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'Listing name is required.'
      }));
      return;
    }

    if (!attr.user_id) {
      log('Failed.');
      reply.code(400).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'User ID is required.'
      }));
      return;
    }

    // Handle JSON:API relationships -> IListing.bookmarks conversion
    const listingData: IListing = { ...attr };
    
    // Get bookmark relationships from the request
    const bookmarkRelationshipData = driver.getRelationshipData('bookmarks');
    
    if (bookmarkRelationshipData) {
      // Handle both single resource linkage and arrays
      const bookmarkRelationships = Array.isArray(bookmarkRelationshipData) 
        ? bookmarkRelationshipData 
        : [bookmarkRelationshipData];
      
      print(`[DEBUG] Converting ${bookmarkRelationships.length} bookmark relationships...`);
      
      // Convert JSON:API bookmark relationships to IListing.bookmarks format
      listingData.bookmarks = bookmarkRelationships.map((bookmarkRef) => {
        // Find the full bookmark data in the included section
        const includedBookmark = driver.findIncluded('bookmarks', bookmarkRef.id);
        
        return {
          is_active: true,
          is_private: false,
          created_at: new Date(),
          bookmark_id: bookmarkRef.id,
          // Extract html_tag from included bookmark attributes if available
          html_tag: includedBookmark?.attributes?.html_tag as string | undefined
        };
      });
      
      log(`[DEBUG] Converted ${listingData.bookmarks.length} bookmark relationships.`);
    }

    const dbListing = await create_listing(listingData);
    log('Done.');
    print('[DEBUG] Sending response...');
    log(dbListing);
    
    // Separate _id from attributes for JSON:API format
    const { _id, ...listingAttributes } = dbListing.toObject();
    
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(listingAttributes, 'listings')
        .withId(_id)
        .build()
    );
  } catch (e) {
    // Handle duplicate name error
    if (e instanceof MongoServerError && e.code === 11000 && e.keyPattern?.name) {
      log('Failed.');
      reply.code(409).send(default_400_error_response({
        title: 'Failed to create listing.',
        detail: 'A listing with this name already exists.'
      }));
      return;
    }

    ler(MSG_500_ERROR_MESSAGE);
    log_err('POST listing', e);
    reply.code(500).send(default_500_error_response(e));
  }
}