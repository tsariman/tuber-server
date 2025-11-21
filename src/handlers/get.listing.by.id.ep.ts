import type { FastifyReply, FastifyRequest } from 'fastify'
import { type PipelineStage, Types } from 'mongoose'
import { ListingModel } from '../model/listing'
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../business.logic/errors'
import { IListingsGet } from '../schema/listings'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { ler, log_err, task, task_end } from '../utility/logging'
import { IBookmarkDocument } from '../schema/bookmarks'

export default async function get_listing_by_id_endpoint (
  request: FastifyRequest<IListingsGet>,
  reply: FastifyReply
) {
  try {
    const listingId = request.params.id
    task(`Getting listing with id '${listingId}' with bookmarks... `)

    // Validate and convert listingId to ObjectId if necessary
    let objectId: Types.ObjectId
    try {
      objectId = new Types.ObjectId(listingId)
    } catch (error) {
      task_end('Failed.\n[DEBUG][400] Invalid listing ID format.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withTitle('Bad Request')
        .withDetail(`Invalid listing ID format: '${listingId}'`)
        .build()
      )
      return
    }

    // Build aggregation pipeline to get listing with populated bookmarks
    // This pipeline performs a complex operation to fetch a listing and join it with bookmark data
    const pipeline: PipelineStage[] = [
      // STAGE 1: Match the specific listing by ID
      // Filter documents to find only the listing with the requested ID that is active
      {
        $match: {
          _id: objectId,           // Find listing with specific ObjectId
          is_active: true          // Only return active listings (not soft-deleted)
        }
      },
      // STAGE 2: Lookup and join bookmarks from the bookmarks collection
      // This performs a complex left join with the bookmarks collection
      {
        $lookup: {
          from: 'bookmarks',              // Join with the 'bookmarks' collection
          
          // Define variables to pass context from the listing document to the lookup pipeline
          let: { 
            // Convert bookmark IDs to ObjectIds for proper matching
            // The listing.bookmarks array contains bookmark references that may be strings
            bookmarkIds: {
              $map: {
                input: { $ifNull: ['$bookmarks', []] },    // Use empty array if bookmarks field is null
                as: 'bookmark',                             // Iterator variable name
                in: {
                  // Conditional conversion: if bookmark_id is a string, convert to ObjectId
                  $cond: {
                    if: { $type: '$$bookmark.bookmark_id' },    // Check if bookmark_id exists/has type
                    then: { $toObjectId: '$$bookmark.bookmark_id' }, // Convert string to ObjectId
                    else: '$$bookmark.bookmark_id'              // Keep as-is if already ObjectId
                  }
                }
              }
            },
            // Pass the original bookmarks array to preserve listing-specific metadata
            listingBookmarks: { $ifNull: ['$bookmarks', []] }
          },
          // Sub-pipeline that operates on the bookmarks collection
          pipeline: [
            // SUB-STAGE 1: Match bookmarks that are referenced by this listing
            {
              $match: {
                $expr: {
                  $and: [
                    // Bookmark's _id must be in the array of bookmarkIds from the listing
                    { $in: ['$_id', '$$bookmarkIds'] },
                    // Only include active bookmarks (not soft-deleted)
                    { $eq: ['$is_active', true] }
                  ]
                }
              }
            },
            // SUB-STAGE 2: Add listing-specific metadata to each bookmark
            // This enriches bookmark data with listing-specific properties like html_tag
            {
              $addFields: {
                // Create a listing_metadata field containing listing-specific bookmark properties
                listing_metadata: {
                  $let: {
                    vars: {
                      // Find the corresponding bookmark entry from the listing's bookmarks array
                      // This contains listing-specific metadata like html_tag, privacy settings, etc.
                      listingBookmark: {
                        $arrayElemAt: [
                          {
                            // Filter the listing's bookmarks array to find the matching bookmark
                            $filter: {
                              input: '$$listingBookmarks',     // The original bookmarks array from listing
                              cond: { 
                                // Match condition: bookmark IDs must be equal
                                $eq: [
                                  {
                                    // Handle type conversion for comparison
                                    $cond: {
                                      if: { $type: '$$this.bookmark_id' },
                                      then: { $toObjectId: '$$this.bookmark_id' },
                                      else: '$$this.bookmark_id'
                                    }
                                  },
                                  '$_id'                        // Current bookmark's _id
                                ]
                              }
                            }
                          },
                          0                                     // Get first (and should be only) match
                        ]
                      }
                    },
                    // Extract specific listing-context properties from the matched bookmark entry
                    in: {
                      html_tag: '$$listingBookmark.html_tag',         // HTML tag for rendering this bookmark in this listing
                      is_private: '$$listingBookmark.is_private',     // Privacy setting for this bookmark in this listing
                      is_active: '$$listingBookmark.is_active',       // Active status in this listing context
                      created_at: '$$listingBookmark.created_at',     // When this bookmark was added to this listing
                      modified_at: '$$listingBookmark.modified_at'    // When this bookmark was last modified in this listing
                    }
                  }
                }
              }
            },
            // SUB-STAGE 3: Remove sensitive/internal fields from bookmark documents
            // Exclude fields that should not be exposed in the API response
            {
              $project: {
                restrict: 0,        // Remove access restriction rules
                rules: 0,           // Remove business logic rules
                reports: 0,         // Remove moderation/reporting data
                __v: 0              // Remove Mongoose version key
              }
            }
          ],
          as: 'populated_bookmarks'          // Store the joined bookmark documents in this field
        }
      },
      
      // STAGE 3: Project the final document structure
      // Shape the output document by including/excluding specific fields
      {
        $project: {
          restrict: 0,                       // Remove listing access restrictions
          rules: 0,                          // Remove listing business rules
          __v: 0,                            // Remove Mongoose version key
          // Replace the original bookmarks array (which contained references) 
          // with the fully populated bookmark documents
          bookmarks: '$populated_bookmarks'
        }
      }
    ]

    // Execute the aggregation pipeline against the ListingModel
    // This returns an array of documents (should be 0 or 1 for a specific ID lookup)
    const aggregationResult = await ListingModel.aggregate(pipeline)
    
    // Check if listing was found
    if (!aggregationResult || aggregationResult.length === 0) {
      task_end('Failed.\n[DEBUG][404] Listing not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail(`Listing with id '${listingId}' not found.`)
        .build()
      )
      return
    }

    // Extract the listing document and its populated bookmarks
    const listing = aggregationResult[0]        // Get the first (and only) result
    const bookmarks = listing.bookmarks || []   // Extract bookmarks array, default to empty array
    
    task_end('Done.')

    // Build JSON:API compliant response with listing as primary data and bookmarks as included resources
    // This follows the JSON:API specification for resource relationships and compound documents
    const responseBuilder = JsonapiResponseBuilder.forSingleResource(listing, 'listings')
      .withId(listing._id)

    // Add bookmark relationships and included resources if bookmarks exist
    if (bookmarks.length > 0) {
      // Create resource identifier objects for the bookmarks relationship
      // These are lightweight references to the full bookmark resources
      const bookmarkRefs = bookmarks.map((bookmark: IBookmarkDocument<string>) => ({
        type: 'bookmarks',     // JSON:API resource type
        id: bookmark._id       // Resource identifier
      }))
      
      // Add the bookmarks relationship to the listing resource
      // This establishes the connection between listing and bookmarks in JSON:API format
      responseBuilder.addRelationship('bookmarks', bookmarkRefs)

      // Add full bookmark resources to the "included" section of the response
      // This allows clients to access complete bookmark data without additional requests
      bookmarks.forEach((bookmark: IBookmarkDocument<string>) => {
        const { _id, ...bookmarkAttributes } = bookmark    // Separate ID from attributes
        responseBuilder.addIncluded({
          type: 'bookmarks',                                 // JSON:API resource type
          id: _id,                                          // Resource identifier
          attributes: bookmarkAttributes                     // All bookmark data except ID
        })
      })
    }

    reply.code(200).send(responseBuilder.build())

  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('GET listing by id with bookmarks', e)
    reply.code(500).send(default_500_error_response(e))
  }
}