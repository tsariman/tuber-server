import { FastifyReply, FastifyRequest } from "fastify"
import { UserPaginationModel, exclude_user_fields } from "src/model/user"
import gen_random_users from "../population/users"
import JsonapiResponseBuilder from "src/business.logic/jsonapi.response.builder"
import Config from "src/config"
// import { connect, disconnect } from "mongoose"
import gen_random_annotations from "../population/annotations"
import { AnnotationPaginationModel, exclude_annotation_fields } from "src/model/annotation"
import { limit_array } from "src/business.logic"

/** 
 * Populates the users collection with random users. Used when populating
 * collections on individual routes.
 */
export async function dev_populate_users (
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
export async function dev_populate_annotations (
  request: FastifyRequest<{ Params: { total: string }}>,
  reply: FastifyReply
) {
  const { total } = request.params
  const number = parseInt(total, 10)
  const genAnnotations = gen_random_annotations(number)
  // await connect(Config.DB_URI)
  const dbAnnotations = limit_array(
    await AnnotationPaginationModel.insertMany(genAnnotations),
    parseInt(Config.PAGINATION_ANNOTATIONS_LIMIT, 10)
  )
  // await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbAnnotations, 'annotations', 'collection')
      .meta('max_loaded_pages', Config.MAX_LOADED_ANNOTATION_PAGES)
      .setResourceFilter(exclude_annotation_fields)
      .mPaginationV2build()
  )
}
