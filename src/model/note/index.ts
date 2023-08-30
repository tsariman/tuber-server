import { model, connect, disconnect, PaginateModel } from 'mongoose'
import Config from 'src/config'
import noteSchema, { INote, INoteDocument } from 'src/schema/notes'


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

export const get_note_collection = async function (): Promise<INoteDocument[]> {
  await connect(Config.DB_URL)
  const noteCollection = await NoteModel.find()
  await disconnect()
  return noteCollection
}