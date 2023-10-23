import { FastifyRequest } from 'fastify'
import mongoose, { Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { IGenericObject, IJsonapiQuerystring, WithRequired } from '../../business.logic/common.types'
import { IJsonapiResource } from '../../../../tuber-client/src/controllers/interfaces/IJsonapi'

export interface IAnnotation {
  is_active?: boolean
  is_published?: boolean
  created_at?: Date
  modified_at?: Date
  is_private?: boolean
  user_id?: string
  author?: string // used by facebook
  videoid: string
  /** When the videoid is not enough e.g. Rumble */
  url?: string
  embed_url?: string
  slug?: string
  platform: string
  start_seconds: number
  end_seconds?: number
  title: string
  note?: string
  rating?: number
  upvotes?: number
  downvotes?: number
  group_id?: string
  html_tag?: string // Within the context of a group, this is the HTML tag that
                    // the annotation is associated with
  sort_order?: number
  restrictions?: string[]
  rules?: string[]
}

/** Available fields for a get request. */
export interface IAnnotationGet {
  Body: IAnnotation
  Params: {
    id: string
  }
  Querystring: IJsonapiQuerystring
}

/** Available fields for a post request. */
export interface IAnnotationPost {
  Body: {
    data: IJsonapiResource<IAnnotation>,
    meta: IGenericObject
  }
}

/** Available fields for a put request. */
export interface IAnnotationPut {
  Body: {
    data: IJsonapiResource<IAnnotation>
  }
  Params: {
    id: string
  }
}

export interface IAnnotationDelete {
  Params: {
    id: string
  }
}

export type TAnnotationGetFastifyRequest = FastifyRequest<IAnnotationGet>
export type TAnnotationPostFastifyRequest = FastifyRequest<IAnnotationPost>
export type TAnnotationPutFastifyRequest = FastifyRequest<IAnnotationPut>
export type TAnnotationDeleteFastifyRequest = FastifyRequest<IAnnotationDelete>

export type TAnnotation = WithRequired<IAnnotation,
  'is_active' | 'created_at' | 'modified_at' | 'is_private' | 'user_id'
>

export interface IAnnotationDocument extends mongoose.Document, TAnnotation {}

const annotationSchema = new Schema<TAnnotation>({
  is_active: { type: Boolean, default: true },
  html_tag: String,
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  is_private: { type: Boolean, default: false },
  is_published: Boolean,
  user_id: String,
  author: String,
  group_id: String,
  videoid: String,
  url: String,
  embed_url: String,
  slug: String,
  platform: String,
  start_seconds: Number,
  end_seconds: Number,
  title: String,
  note: String,
  rating: Number,
  upvotes: Number,
  downvotes: Number,
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
})

annotationSchema.index({ title: 1, note: 1 })

annotationSchema.plugin(paginate)

export default annotationSchema