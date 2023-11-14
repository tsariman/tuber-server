import mongoose from 'mongoose'

/** Configuration saved to the database */
export interface IDbConfiguration {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  key: string
  value: string
  restrictions?: string[]
  rules?: string[]
}

export interface IDbConfigurationDocument extends mongoose.Document, IDbConfiguration {}

const configurationSchema = new mongoose.Schema<IDbConfiguration>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
})

export default configurationSchema