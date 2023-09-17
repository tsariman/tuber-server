import {
  model,
  connect,
  disconnect,
  PaginateModel,
  PaginateResult
} from 'mongoose'
import { get_query } from 'src/business.logic'
import { IDoc } from 'src/business.logic/common.types'
import Config from 'src/config'
import noteSchema, {
  INote,
  INoteDocument,
  TNote,
  TNotesFastifyRequest
} from 'src/schema/notes'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...Config.DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...Config.DB_PAGINATION_OPTIONS,
  select: {
    __v: 0,
    is_active: 0,
    is_private: 0,
    restrictions: 0,
    rules: 0
  }

  // TODO Add custom pagination options here
}

export const NotePaginationModel = model<
  INoteDocument,
  PaginateModel<INoteDocument>
>('notes', noteSchema)

export const NoteModel = model<TNote>('notes', noteSchema)

/** Exclude fields from the note document. @deprecated */
export const exclude_note_fields = (note: IDoc) => {
  const {
    _doc: {
      _id,
      active,
      is_private,
      restrictions,
      rules,
      __v,
      ...noteDoc
    }
  } = note
  return noteDoc
}

export const get_note_by_id = async function (id: string): Promise<INoteDocument | null> {
  await connect(Config.DB_URL)
  const noteDoc = await NotePaginationModel.findById(id)
  await disconnect()
  return noteDoc
}

export const create_note = async function (noteInfo: INote): Promise<INoteDocument> {
  await connect(Config.DB_URL)
  const noteModel = await NotePaginationModel.create(noteInfo)
  const note = await noteModel.save()
  await disconnect()
  return note
}

export const get_note_collection = async function (
  req: TNotesFastifyRequest
): Promise<PaginateResult<INoteDocument>> {
  const page = Number(get_query(req, 'page[number]', '1'))
  const limit = Number(get_query(req, 'page[size]', Config.PAGINATION_NOTES_LIMIT))
  Config.log(`Getting notes collection (page ${page}, limit ${limit})...`)
  await connect(Config.DB_URL)
  const result = await NotePaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
  await disconnect()
  return result
}

export const get_note_document_count = async function (): Promise<number> {
  await connect(Config.DB_URL)
  const count = await NoteModel.countDocuments()
  await disconnect()
  return count
}
