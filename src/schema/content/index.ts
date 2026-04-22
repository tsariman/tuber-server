import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

/**
 * A localized variant of a content block.
 * Stores the same content in a specific language.
 */
export interface IContentLocalization {
  [language_code: string]: {
    html: string
    description?: string
  }
}

/**
 * A named HTML/text content block stored in the database.
 * Content blocks are looked up by `name` (the identifier used in page state,
 * e.g. `'content': '$html : textContentName'`).
 */
export interface IContent {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  /** Unique name used to identify this content block, e.g. `'privacy-policy'`. */
  name: string
  /** The HTML or plain-text body of the content block. */
  html: string
  /** Optional human-readable description for admin/editorial purposes. */
  description?: string
  /** Optional per-language overrides of `html`. */
  localization?: IContentLocalization
  restrictions?: string[]
  rules?: string[]
}

export interface IContentDocument
  extends mongoose.Document, IContent {}

const contentSchema = new mongoose.Schema<IContentDocument>({
  is_active:    { type: Boolean, default: true },
  created_at:   { type: Date, default: Date.now },
  modified_at:  Date,
  name:         { type: String, required: true, unique: true },
  html:         { type: String, required: true },
  description:  { type: String, default: undefined },
  localization: { type: Object, default: undefined },
  restrictions: { type: [String], default: undefined },
  rules:        { type: [String], default: undefined },
})

contentSchema.plugin(paginate)

export default contentSchema
