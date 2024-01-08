import mongoose from 'mongoose';
import { IJsonapiQuerystring } from '../../common.types';
import paginate from 'mongoose-paginate-v2';

export interface IListing {
  is_active?: boolean;
  /** Only the user who created the listing can see it. */
  is_private?: boolean;
  /** Will come up in the global search result if this is true. */
  is_published?: boolean;
  name: string;
  description?: string;
  /** The user who created the listing. */
  user_id?: string;
  created_at?: Date;
  modified_at?: Date;
  slug?: string;
  tags?: string[];
  bookmarks?: {
    is_active?: boolean;
    /**
     * Only the user who created the listing can see this bookmark is
     * included.
     */
    is_private?: boolean;
    created_at?: Date;
    modified_at?: Date;
    /** 
     * Within the context of a listing, this is the HTML tag that
     * the bookmark is associated with.
     */
    html_tag?: string;
    bookmark_id?: string;
  }[];
  restrict?: Record<string, string>;
  rules?: Record<string, string>;
}

export interface IListingsEndpoint {
  Body: IListing;
  Params: {
    id: string;
  };
  Querystring: IJsonapiQuerystring;
}

export interface IListingDocument extends mongoose.Document, IListing {}

const listingSchema = new mongoose.Schema<IListingDocument>({
  is_active: { type: Boolean, default: true },
  is_private: { type: Boolean, default: false },
  is_published: { type: Boolean, default: false },
  name: { type: String, required: true, unique: true },
  description: String,
  user_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  slug: String,
  tags: [ String ],
  bookmarks: [{
    is_active: { type: Boolean, default: true },
    is_private: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    modified_at: Date,
    html_tag: String,
    bookmark_id: { type: String, required: true }
  }],
  restrict: { type: Map, of: String, default: undefined },
  rules: { type: Map, of: String, default: undefined }
});

listingSchema.index({ name: 'text', description: 'text' });
listingSchema.plugin(paginate);

export default listingSchema;