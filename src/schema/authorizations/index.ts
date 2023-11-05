import mongoose from 'mongoose'

export interface IAuthorizationUrl {
  purpose: string
  url: string
}

export interface IAuthorizationKey {
  purpose: string
  key: string
  expires_in?: Date
}

export interface IAuthorizations {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  host: string
  urls?: IAuthorizationUrl[]
  keys: IAuthorizationKey[]
  restrictions?: string[]
  rules?: string[]
}

export interface IAuthorizationDocument extends mongoose.Document, IAuthorizations {}

const authorizationSchema = new mongoose.Schema<IAuthorizations>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  host: { type: String, required: true, unique: true },
  urls: [{
    purpose: { type: String, required: true, unique: true },
    url: String
  }],
  keys: [{
    purpose: { type: String, required: true, unique: true },
    key: String,
    expires_in: Date
  }],
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
})

export default authorizationSchema
