import Config from '../../config'
import { PipelineStage } from 'mongoose'
import { DB_PAGINATION_QUERY, TO } from '@tuber/shared'
import { TContextualUser } from '../../schema/user'
import { IBookmarkQuerySearch } from '../../schema/bookmark'
import Access from '../../business.logic/security/Access'
import CLEARANCE_LEVEL from '../../business.logic/security/clearance.level'
import { TSearchMode } from '../../common.types'

/** MongoDB pipeline to find bookmarks using a search query. */
export default function get_bookmark_search_query_pipeline(
  query: IBookmarkQuerySearch,
  usr?: TContextualUser
) {
  const pipeline: PipelineStage[] = []

  const { searchQuery, page, limit, searchMode } = query
  const skip = (page - 1) * limit

  if (searchQuery) {
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
    
    // Build match condition based on searchMode and user permissions
    // 'public' - search only published bookmarks, excluding user's published bookmarks
    // 'private' - search only user's bookmarks, whether they're published or not
    // 'all' - search published bookmarks and user's own bookmarks, regardless of
    //         publication status
    const matchConditions: unknown[] = buildMatchConditions(searchMode, usr)
    
    const matchQuery = { ...DB_PAGINATION_QUERY } as TO
    if (matchConditions.length > 0) {
      matchQuery.$or = matchConditions
    }
    
    pipeline.push({
      $match: matchQuery
    })
    pipeline.push({
      $facet: {
        metadata: [
          { $count: 'totalItems' }
        ],
        results: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              created_at: 1,
              modified_at: 1,
              user_id: 1,
              inception_clearance: 1,
              videoid: 1,
              platform: 1,
              start_seconds: 1,
              end_seconds: 1,
              title: 1,
              note: 1,
              upvotes: 1,
              downvotes: 1,
              url: 1,
              embed_url: 1,
              slug: 1,
              thumbnail_url: 1,
              author: 1,
              is_published: 1,
              score: { $meta: 'searchScore' },
            }
          }
        ]
      }
    })
    pipeline.push({
      $project: {
        results: 1,
        totalItems: {
          $ifNull: [
            { $arrayElemAt: ['$metadata.totalItems', 0] },
            0
          ]
        }
      }
    })
  }
  return pipeline
}

/**
 * Build match conditions based on searchMode and user permissions.
 * @param searchMode - 'public' | 'private' | 'all' | undefined
 * @param usr - The contextual user making the request
 */
function buildMatchConditions(
  searchMode: TSearchMode | undefined,
  usr?: TContextualUser
): unknown[] {
  const matchConditions: unknown[] = []

  switch (searchMode) {
    case 'private':
      // Search only user's bookmarks (published or not)
      if (usr?._id) {
        matchConditions.push({ user_id: String(usr._id) })
      } else {
        // Non-authenticated users cannot search private bookmarks
        matchConditions.push({ _id: null }) // Match nothing
      }
      break

    case 'public':
      // Search only published bookmarks (all users can see all published bookmarks)
      matchConditions.push({ is_published: { $eq: true } })
      break

    case 'all':
    default:
      // Search published bookmarks and user's own bookmarks
      if (usr?._id) {
        // Published bookmarks are visible to everyone
        matchConditions.push({ is_published: { $eq: true } })

        // User's own bookmarks (regardless of publish status)
        matchConditions.push({ user_id: String(usr._id) })

        // Users can see unpublished bookmarks where their clearance is greater
        // than the bookmark's inception_clearance
        if (usr && Access.the(usr).can('read.unpublished.bookmark')) {
          matchConditions.push({
            is_published: { $ne: true },
            inception_clearance: { $lt: CLEARANCE_LEVEL[usr.role] }
          })
        }
      } else {
        // Non-authenticated users can only see published bookmarks
        matchConditions.push({ is_published: { $eq: true } })
      }
      break
  }

  return matchConditions
}