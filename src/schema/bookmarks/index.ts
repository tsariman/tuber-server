import { FastifyRequest } from 'fastify'
import mongoose, { Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { IGenericObject, IJsonapiQuerystring, WithRequired } from '../../common.types'
import { IJsonapiResource } from '../../../../tuber-client/src/controllers/interfaces/IJsonapi'

export interface IBookmark {
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
  thumbnail_url?: string
  group_id?: string
  html_tag?: string // Within the context of a group, this is the HTML tag that
                    // the bookmark is associated with
  sort_order?: number
  restrictions?: string[]
  rules?: string[]
}

/** Available fields for a get request. */
export interface IBookmarkGet {
  Body: IBookmark
  Params: {
    id: string
  }
  Querystring: IJsonapiQuerystring
}

/** Available fields for a post request. */
export interface IBookmarkPost {
  Body: {
    data: IJsonapiResource<IBookmark>,
    meta: IGenericObject
  }
}

/** Available fields for a put request. */
export interface IBookmarkPut {
  Body: {
    data: IJsonapiResource<IBookmark>
  }
  Params: {
    id: string
  }
}

export interface IBookmarkDelete {
  Params: {
    id: string
  }
}

export type TBookmarkGetFastifyRequest = FastifyRequest<IBookmarkGet>
export type TBookmarkPostFastifyRequest = FastifyRequest<IBookmarkPost>
export type TBookmarkPutFastifyRequest = FastifyRequest<IBookmarkPut>
export type TBookmarkDeleteFastifyRequest = FastifyRequest<IBookmarkDelete>

export type TBookmark = WithRequired<IBookmark,
  'is_active' | 'created_at' | 'modified_at' | 'is_private' | 'user_id'
>

export interface IBookmarkDocument extends mongoose.Document, TBookmark {}

const bookmarkSchema = new Schema<TBookmark>({
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

bookmarkSchema.index({ title: 1, note: 1 })

bookmarkSchema.plugin(paginate)

export default bookmarkSchema