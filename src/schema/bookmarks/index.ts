import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { TJsonapiResource } from '../../shared';
import {
  IJsonapiQuerystring,
  TObj,
  WithRequired
} from '../../common.types';

/**
 * 'G' - General
 * 'PG' - Parental Guidance
 * 'R' - Restricted
 * 'X' - Adult
 */
export type TAudience ='G' | 'PG' | 'R' | 'X';

export type TReportReason = 'hide' 
  | 'broken link'
  | 'broken embed'
  | 'rude'
  | 'inappropriate'
  | 'spam'
  | 'other';

export interface IBookmark {
  is_active?: boolean;
  is_published?: boolean;
  created_at?: Date;
  modified_at?: Date;
  is_private?: boolean;
  user_id?: string;
  author?: string; // used by facebook
  videoid?: string;
  /** When the videoid is not enough e.g. Rumble */
  url?: string;
  embed_url?: string;
  slug?: string;
  platform: string;
  start_seconds: number;
  end_seconds?: number;
  title: string;
  note?: string;
  rating?: number;
  upvotes?: number;
  downvotes?: number;
  thumbnail_url?: string;
  targeted_audience?: TAudience;
  /** Number of times this bookmark has been played. */
  play_count?: number;
  /**
   * Number of times this bookmark has been reported.
   * [TODO] If the report count is greater than 10, the bookmark will be
   *        unpublished.
   */
  report_count?: number;
  /**
   * [TODO] Users can hide bookmarks they do not like. Hiding will be
   * a report with the reason 'hide'. 
   * [TODO] If a user reports a bookmark, it will be hidden from them.
   */
  reports?: {
    is_active?: boolean;
    created_at?: Date;
    modified_at?: Date;
    /** The user who reported this bookmark. */
    user_id?: string;
    /** The reason why this bookmark was reported. */
    reason?: string;
  }[]
  restrict?: Record<string, string>;
  rules?: Record<string, string>;
}

/** Partial bookmark. Used when working with some properties but not all. */
export type TBookmarkFrag = Partial<IBookmark>;

/** Available fields for a get request. */
export interface IBookmarkGet {
  Body: IBookmark;
  Params: {
    id: string;
  };
  Querystring: IJsonapiQuerystring;
}

/** Available fields for a post request. */
export interface IBookmarkPost {
  Body: {
    data: TJsonapiResource<IBookmark>;
    meta: TObj;
  };
}

/** Available fields for a put request. */
export interface IBookmarkPut {
  Body: {
    data: TJsonapiResource<IBookmark>;
  };
  Params: {
    id: string;
  };
}

export interface IBookmarkDelete {
  Params: {
    id: string;
  };
}

export type TBookmark = WithRequired<IBookmark,
  'is_active' | 'created_at' | 'modified_at' | 'is_private' | 'user_id'
>;

export interface IBookmarkDocument extends mongoose.Document, TBookmark {};

const bookmarkSchema = new Schema<IBookmarkDocument>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  is_private: { type: Boolean, default: false },
  is_published: Boolean,
  user_id: { type: String, required: true },
  author: String,
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
  thumbnail_url: String,
  targeted_audience: String,
  play_count: Number,
  report_count: Number,
  reports: {
    type: [{
      is_active: { type: Boolean, default: true },
      created_at: { type: Date, default: Date.now },
      modified_at: Date,
      user_id: String,
      reason: String
    }],
    default: undefined
  },
  restrict: { type: Map, of: String, default: undefined },
  rules: { type: Map, of: String, default: undefined }
});

bookmarkSchema.index({ title: 1, note: 1 });

bookmarkSchema.plugin(paginate);

export default bookmarkSchema;