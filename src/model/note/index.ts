import { model, connect, disconnect, PaginateModel, PaginateResult } from 'mongoose'
import Config from 'src/config'
import noteSchema, { INote, INoteDocument } from 'src/schema/notes'

const PAGINATION_OPTONS = {
  limit: Config.PAGINATION_NOTE_LIMIT,
  sort: { createdAt: -1 }
}

export const NoteModel = model<
  INoteDocument,
  PaginateModel<INoteDocument>
>('notes', noteSchema)

export const get_note_by_id = async function (id: string): Promise<INoteDocument | null> {
  await connect(Config.DB_URL)
  const noteDoc = await NoteModel.findById(id)
  await disconnect()
  return noteDoc
}

export const create_note = async function (noteInfo: INote): Promise<INoteDocument> {
  await connect(Config.DB_URL)
  const noteModel = await NoteModel.create(noteInfo)
  const note = await noteModel.save()
  await disconnect()
  return note
}

export const get_note_collection = async function (
  page = 1
): Promise<PaginateResult<INoteDocument>> {
  await connect(Config.DB_URL)
  const result = await NoteModel.paginate({}, {
    ...PAGINATION_OPTONS,
    page
  })
  await disconnect()
  return result
}