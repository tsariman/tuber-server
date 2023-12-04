import { PipelineStage } from 'mongoose'
import { IBookmarkDocument } from '../../schema/bookmarks'
import { BookmarkModel } from '.'
import Config from '../../config'

export default async function get_bookmark_by_slug (
  slug: string
): Promise<IBookmarkDocument | null> {
  const pipeline: PipelineStage[] = []
  pipeline.push({
    $search: {
      index: Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
      text: {
        query: slug,
        path: [ 'slug' ]
      },
    },
  })
  pipeline.push({
    $match: { slug }
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
      score: { $meta: 'searchScore' }
    }
  })
  pipeline.push({
    $limit: 1
  })
  const aggregationResult = await BookmarkModel.aggregate(pipeline)
  const dbDoc: IBookmarkDocument | null = aggregationResult[0] ?? null
  return dbDoc
}