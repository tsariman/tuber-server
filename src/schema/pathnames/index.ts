import { Schema } from 'mongoose'

export interface IPathname {
  name: string
  path: string
  modified_at: Date
}

export interface IPathnameDocument extends IPathname, Document {}

const pathnameSchema = new Schema<IPathname>({
  name: { type: String, required: true, unique: true },
  path: String,
  modified_at: { type: Date, default: undefined }
})

export default pathnameSchema