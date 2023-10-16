import { model } from 'mongoose'
import sessionSchema, { ISession } from '../schema/sessions'

export const SessionModel = model<ISession>('Session', sessionSchema)


