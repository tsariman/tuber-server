import { FastifyReply, FastifyRequest } from "fastify"
import { UserModel } from "src/model/user"
import gen_random_users from "../population/users"
import JsonapiResponseBuilder from "src/business.logic/jsonapi.response.builder"
import Config from "src/config"
import { connect, disconnect } from "mongoose"
import gen_random_notes from "../population/notes"
import { NoteModel } from "src/model/note"

type TPopulateFastifyRequest = FastifyRequest<{
  Params: {
    total: string
  }
}>

export async function dev_populate_users (
  request: TPopulateFastifyRequest,
  reply: FastifyReply
) {
  const { total } = request.params
  const number = parseInt(total, 10)
  const genUsers = gen_random_users(number)
  await connect(Config.DB_URL)
  const dbUsers = await UserModel.insertMany(genUsers)
  await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbUsers, 'users', 'collection')
      .build()
  )
}

export async function dev_populate_notes (
  request: TPopulateFastifyRequest,
  reply: FastifyReply
) {
  const { total } = request.params
  const number = parseInt(total, 10)
  const genNotes = gen_random_notes(number)
  await connect(Config.DB_URL)
  const dbNotes = await NoteModel.insertMany(genNotes)
  await disconnect()
  reply.send(
    new JsonapiResponseBuilder(dbNotes, 'notes', 'collection')
      .build()
  )
}