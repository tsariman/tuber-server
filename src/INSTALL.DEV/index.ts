import { connect, disconnect } from 'mongoose'
import Config from 'src/config'
import { NoteModel } from 'src/model/note'
import { UserModel } from 'src/model/user'

export async function get_documents_count () {
  await connect(Config.DB_URL)
  const noteCount = (await NoteModel.countDocuments()).toString()
  const userCount = (await UserModel.countDocuments()).toString()
  await disconnect()
  Config.log('counts:', { noteCount, userCount })
  return { noteCount, userCount }
}
