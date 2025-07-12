import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface ICountry extends Document {
  is_active?: boolean;
  created_at?: Date;
  modified_at?: Date;
  name: string;
  languageCode: string[];
  restrictions?: string[];
  rules?: string[];
}

export interface ICountryDocument
  extends mongoose.Document, ICountry {};

const countrySchema: Schema = new Schema({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  name: { type: String, required: true },
  languageCode: { type: [ String ], required: true },
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
});

countrySchema.plugin(paginate);

export default countrySchema;