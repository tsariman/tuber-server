import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface IReadableLanguageText {
  is_active?: boolean;
  created_at?: Date;
  modified_at?: Date;
  language_code: string;
  text: string;
  description?: string;
  restrictions?: string[];
  rules?: string[];
}

interface IReadableLocalization {
  [language_code: string]: IReadableLanguageText
}

/** Readable saved to the database */
export interface IReadable {
  is_active?: boolean;
  created_at?: Date;
  modified_at?: Date;
  key: string;
  text: string;
  description: string;
  localization: IReadableLocalization
  restrictions?: string[];
  rules?: string[]
}

export interface IReadableDocument
  extends mongoose.Document, IReadable {};

const readableSchema = new mongoose.Schema<IReadableDocument>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  key: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  description: { type: String, default: undefined },
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
});

readableSchema.plugin(paginate);

export default readableSchema;