import { FastifyReply, FastifyRequest } from 'fastify'
import { transform_user_doc, UserPaginationModel } from '../../model/user'
import gen_random_users from '../../dev/population/users'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import Config from '../../config'
import gen_random_bookmarks from '../../dev/population/bookmarks'
import { BookmarkPaginationModel, transform_bookmark_doc } from '../../model/bookmark'
import { limit_array } from '../../business.logic'

/** 
 * Populates the users collection with random users. Used when populating
 * collections on individual routes.
 */
export async function dev_post_users_populate_endpoint (
  request: FastifyRequest<{ Params: { total: string }}>,
  reply: FastifyReply
) {
  const { total } = request.params
  const number = parseInt(total, 10)
  const genUsers = gen_random_users(number)
  const dbUsers = limit_array(
    await UserPaginationModel.insertMany(genUsers),
    parseInt(Config.PAGINATION_USERS_LIMIT, 10)
  )
  reply.send(JsonapiResponseBuilder.forCollection()
    .withDocuments(dbUsers, 'users', transform_user_doc)
    .withMeta({ max_loaded_pages: Config.MAX_LOADED_USER_PAGES })
    .build())
}

/**
 * Populates the annoations collection with random data. Used when populating
 * collections on individual routes.
 */
export async function dev_post_bookmarks_populate_endpoint (
  request: FastifyRequest<{ Params: { total: string }}>,
  reply: FastifyReply
) {
  const { total } = request.params
  const number = parseInt(total, 10)
  const genBookmarks = await gen_random_bookmarks(number)
  const dbBookmarks = limit_array(
    await BookmarkPaginationModel.insertMany(genBookmarks),
    parseInt(Config.PAGINATION_BOOKMARKS_LIMIT, 10)
  )
  reply.send(
    JsonapiResponseBuilder.forCollection()
      .withDocuments(dbBookmarks, 'bookmarks', transform_bookmark_doc)
      .withMeta({ max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES })
      .build()
  )
}
