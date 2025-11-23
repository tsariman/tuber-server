import { Schema } from 'mongoose';

export interface IEntry {
  http_status: number;
  collection: string;
  document_version: string;
  created?: Date;
  payload?: string;
}

const entrySchema = new Schema<IEntry>({
  http_status: Number,
  collection: String, // Name of the collection i.e. Businesses, Reservations... etc.
  document_version: String,
  created: { type: Date, default: Date.now },
  payload: {  // content of the POST request
    type: String,
    default: null
  }
});

export default entrySchema;