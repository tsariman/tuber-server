import {
  model,
  // connect,
  // disconnect,
  PaginateModel,
  PaginateResult
} from 'mongoose'
import { IMPV2Doc } from '../../business.logic/common.types'
import Config from '../../config'
import annotationSchema, {
  IAnnotation,
  IAnnotationDocument,
  TAnnotation,
} from '../../schema/annotations'

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

export const AnnotationPaginationModel = model<
  IAnnotationDocument,
  PaginateModel<IAnnotationDocument>
>('annotations', annotationSchema)

export const AnnotationModel = model<TAnnotation>('annotations', annotationSchema)

/** Exclude fields from the annotation document. @deprecated */
export const exclude_annotation_fields = (annotation: IMPV2Doc) => {
  const {
    _doc: {
      _id,
      active,
      is_private,
      restrictions,
      rules,
      __v,
      ...annotationDoc
    }
  } = annotation
  return annotationDoc
}

export const get_annotation_by_id = async function (
  id: string
): Promise<IAnnotationDocument | null> {
  // await connect(Config.DB_URI)
  const annotationDoc = await AnnotationPaginationModel.findById(id)
  // await disconnect()
  return annotationDoc
}

export const create_annotation = async function (
  annotationInfo?: IAnnotation
): Promise<IAnnotationDocument> {
  if (!annotationInfo) {
    throw new Error('Annotation info is required')
  }
  // await connect(Config.DB_URI)
  const annotationModel = await AnnotationPaginationModel.create(annotationInfo)
  const annotation = await annotationModel.save()
  // await disconnect()
  return annotation
}

export const get_annotation_collection = async function (
  page: number,
  limit: number
): Promise<PaginateResult<IAnnotationDocument>> {
  // await connect(Config.DB_URI)
  const result = await AnnotationPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
  // await disconnect()
  return result
}

export const get_annotation_document_count = async function (): Promise<number> {
  // await connect(Config.DB_URI)
  const count = await AnnotationModel.countDocuments()
  // await disconnect()
  return count
}
