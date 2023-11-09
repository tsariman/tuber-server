import { PaginateModel, PaginateResult, model } from 'mongoose'
import Config from '../../config'
import pathnameSchema, { IPathnameDocument } from 'src/schema/pathnames'

const PAGINATION_QUERY = {
  ...Config.DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

const PAGINATION_OPTONS = {
  ...Config.DB_PAGINATION_OPTIONS,
  select: { __v: 0 }

  // TODO Add custom pagination options here
}

export const PathnamePaginationModel = model<
  IPathnameDocument,
  PaginateModel<IPathnameDocument>
>('pathnames', pathnameSchema)

export const PathnameModel = model<IPathnameDocument>(
  'pathnames',
  pathnameSchema
)

export async function pathname_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IPathnameDocument>> {
  return await PathnamePaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
}

export async function pathname_get_by_name(name: string) {
  return await PathnamePaginationModel.findOne({ name })
}

export async function pathname_get_all() {
  return await PathnamePaginationModel.find({})
}

export async function pathname_save(name: string, path: string) {
  const pathname = new PathnameModel({ name, path })
  return await pathname.save()
}

export async function pathname_update(name: string, path: string) {
  return await PathnameModel.updateOne({ name }, { path })
}