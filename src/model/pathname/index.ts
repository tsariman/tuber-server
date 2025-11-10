import { PaginateModel, PaginateResult, model } from 'mongoose';
import pathnameSchema, { IPathnameDocument } from '../../schema/pathnames';
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '@tuber/shared';

const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
};

const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,

  // TODO Add custom pagination options here
};

export const PathnamePaginationModel = model<
  IPathnameDocument,
  PaginateModel<IPathnameDocument>
>('pathnames', pathnameSchema);

export const PathnameModel = model<IPathnameDocument>(
  'pathnames',
  pathnameSchema
);

export async function pathname_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IPathnameDocument>> {
  return await PathnamePaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  });
}

export async function pathname_get_by_name(name: string) {
  return await PathnamePaginationModel.findOne({ name });
}

export async function pathname_get_all() {
  return await PathnamePaginationModel.find({});
}

export async function pathname_save(name: string, path: string) {
  const pathname = new PathnameModel({ name, path });
  return await pathname.save();
}

export async function pathname_update(name: string, path: string) {
  return await PathnameModel.updateOne({ name }, { path });
}