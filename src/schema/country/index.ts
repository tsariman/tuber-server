import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface ICountry {
  is_active?: boolean;
  created_at?: Date;
  modified_at?: Date;
  name: string;
  languageCode: string[];
  restrictions?: string[];
  rules?: string[];
}

export interface ICountryDocument<T=unknown>
  extends mongoose.Document<T>, ICountry {};

const countrySchema: Schema = new Schema<ICountryDocument>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  name: { type: String, required: true },
  languageCode: { type: [ String ], required: true },
  restrictions: { type: Map, of: String, default: undefined },
  rules: { type: Map, of: String, default: undefined }
});

countrySchema.plugin(paginate);

export default countrySchema;