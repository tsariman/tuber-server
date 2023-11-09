import mongoose from 'mongoose'

export interface IAuthorizationUrl {
  purpose: string
  url: string
  created_at?: Date
  modified_at?: Date
  restrictions?: string[]
  rules?: string[]
}

export interface IAuthorizationKey {
  name: string
  value: string
  expires_in?: number
  created_at?: Date
  modified_at?: Date,
  restrictions?: string[]
  rules?: string[]
}

export type TAuthorizationKeyNew = Omit<IAuthorizationKey,
  'created_at'
  | 'modified_at'
  | 'rules'
  | 'restrictions'
>

export interface IAuthorizations {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  platform: string
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
  platform: { type: String, required: true, unique: true },
  urls: {
    type: [{
      purpose: { type: String, required: true, unique: true },
      url: String,
      created_at: { type: Date, default: Date.now },
      modified_at: Date,
      restrictions: { type: [ String ], default: undefined },
      rules: { type: [ String ], default: undefined }
    }],
    default: undefined
  },
  keys: {
    type: [{
      name: { type: String, required: true, unique: true },
      value: String,
      expires_in: Number,
      created_at: { type: Date, default: Date.now },
      modified_at: Date,
      restrictions: { type: [ String ], default: undefined },
      rules: { type: [ String ], default: undefined }
    }],
    default: undefined
  },
  restrictions: { type: [ String ], default: undefined },
  rules: { type: [ String ], default: undefined }
})

export default authorizationSchema
