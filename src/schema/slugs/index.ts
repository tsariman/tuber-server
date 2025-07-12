import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

/** Slug saved to the database */
export interface IDbSlug {
  is_active?: boolean;
  created_at?: Date;
  modified_at?: Date;
  slug: string;
  restrictions?: string[];
  rules?: string[];
}

export interface IDbSlugDocument extends mongoose.Document, IDbSlug {};

const slugSchema = new mongoose.Schema<IDbSlugDocument>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  slug: { type: String, required: true, unique: true },
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
});

slugSchema.plugin(paginate);

export default slugSchema;