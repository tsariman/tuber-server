import { FastifyReply, FastifyRequest } from "fastify"
import { UserPaginationModel, exclude_user_fields } from "src/model/user"
import gen_random_users from "../population/users"
import JsonapiResponseBuilder from "src/business.logic/jsonapi.response.builder"
import Config from "src/config"
import { connect, disconnect } from "mongoose"
import gen_random_notes from "../population/notes"
import { NotePaginationModel, exclude_note_fields } from "src/model/note"
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
  await connect(Config.DB_URL)
  const dbUsers = limit_array(
    await UserPaginationModel.insertMany(genUsers),
    parseInt(Config.PAGINATION_USERS_LIMIT, 10)
  )
  await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbUsers, 'users', 'collection')
      .meta('max_loaded_pages', Config.MAX_LOADED_USER_PAGES)
      .setResourceFilter(exclude_user_fields)
      .build()
  )
}

/**
 * Populates the notes collection with random data. Used when populating
 * collections on individual routes.
 */
export async function dev_populate_notes (
  request: FastifyRequest<{ Params: { total: string }}>,
  reply: FastifyReply
) {
  const { total } = request.params
  const number = parseInt(total, 10)
  const genNotes = gen_random_notes(number)
  await connect(Config.DB_URL)
  const dbNotes = limit_array(
    await NotePaginationModel.insertMany(genNotes),
    parseInt(Config.PAGINATION_NOTES_LIMIT, 10)
  )
  await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbNotes, 'notes', 'collection')
      .meta('max_loaded_pages', Config.MAX_LOADED_NOTE_PAGES)
      .setResourceFilter(exclude_note_fields)
      .build()
  )
}
