import Config from '../../config'
import { PipelineStage } from 'mongoose'
import { DB_PAGINATION_QUERY } from '@tuber/shared'
import { TCipheredUser } from '../../schema/user'
import { IBookmarkQuerySearch } from '../../schema/bookmark'
import Access from '../../business.logic/security/Access'

/** MongoDB pipeline to find bookmarks using a search query. */
export default function get_bookmark_search_query_pipeline(
  query: IBookmarkQuerySearch,
  usr?: TCipheredUser
) {
  const pipeline: PipelineStage[] = []
  const { searchQuery, page, limit } = query
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
    
    // Build match condition based on user permissions
    const matchConditions: any[] = [
      { is_published: { $eq: true } } // Published bookmarks visible to all
    ]
    
    // User's own bookmarks (regardless of publish status)
    if (usr?._id) {
      matchConditions.push({ user_id: usr._id })
    }
    
    // Users with clearance level 4+ can see all unpublished bookmarks
    if (Access.the(usr).can('read.unpublished.bookmark')) {
      matchConditions.push({ is_published: { $ne: true } })
    }
    
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