import Config from '../../config'
import { PipelineStage } from 'mongoose'
import { DB_PAGINATION_QUERY } from '@tuber/shared'
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
    const matchConditions: any[] = buildMatchConditions(searchMode, usr)
    
    pipeline.push({
      $match: {
        ...DB_PAGINATION_QUERY,
        $or: matchConditions
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
        thumbnail_url: 1,
        restrictions: 1,
        rules: 1,
        author: 1,
        is_published: 1,
        results: {
          $slice: ['$results', (page - 1) * limit, limit]
        },
        score: { $meta: 'searchScore' },
        totalItems: 1,
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
): any[] {
  const matchConditions: any[] = []

  switch (searchMode) {
    case 'private':
      // Search only user's bookmarks (published or not)
      if (usr?._id) {
        matchConditions.push({ user_id: usr._id })
      }
      break

    case 'public':
      // Search only published bookmarks, excluding user's published bookmarks
      if (usr?._id) {
        matchConditions.push({
          is_published: { $eq: true },
          user_id: { $ne: usr._id }
        })
      } else {
        matchConditions.push({ is_published: { $eq: true } })
      }
      break

    case 'all':
    default:
      // Search published bookmarks and user's own bookmarks
      matchConditions.push({ is_published: { $eq: true } })

      // User's own bookmarks (regardless of publish status)
      if (usr?._id) {
        matchConditions.push({ user_id: usr._id })
      }

      // Users can see unpublished bookmarks where their clearance is greater
      // than the bookmark's inception_clearance
      if (usr && Access.the(usr).can('read.unpublished.bookmark')) {
        matchConditions.push({
          is_published: { $ne: true },
          inception_clearance: { $lt: CLEARANCE_LEVEL[usr.role] }
        })
      }
      break
  }

  return matchConditions
}