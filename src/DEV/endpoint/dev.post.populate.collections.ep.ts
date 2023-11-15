import { FastifyReply, FastifyRequest } from "fastify"
import { UserPaginationModel, exclude_user_fields } from "src/model/user"
import gen_random_users from "../population/users"
import JsonapiResponseBuilder from "src/business.logic/jsonapi.response.builder"
import Config from "src/config"
// import { connect, disconnect } from "mongoose"
import gen_random_bookmarks from "../population/bookmarks"
import { BookmarkPaginationModel, exclude_bookmark_fields } from "src/model/bookmark"
import { limit_array } from "src/business.logic"

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
  // await connect(Config.DB_URI)
  const dbUsers = limit_array(
    await UserPaginationModel.insertMany(genUsers),
    parseInt(Config.PAGINATION_USERS_LIMIT, 10)
  )
  // await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbUsers, 'users', 'collection')
      .meta('max_loaded_pages', Config.MAX_LOADED_USER_PAGES)
      .setResourceFilter(exclude_user_fields)
      .mPaginationV2build()
  )
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
  const genBookmarks = gen_random_bookmarks(number)
  // await connect(Config.DB_URI)
  const dbBookmarks = limit_array(
    await BookmarkPaginationModel.insertMany(genBookmarks),
    parseInt(Config.PAGINATION_BOOKMARKS_LIMIT, 10)
  )
  // await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbBookmarks, 'bookmarks', 'collection')
      .meta('max_loaded_pages', Config.MAX_LOADED_BOOKMARK_PAGES)
      .setResourceFilter(exclude_bookmark_fields)
      .mPaginationV2build()
  )
}
