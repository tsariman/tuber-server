import { model } from 'mongoose'
import sessionSchema, { ISession } from 'src/schema/sessions'

export const SessionModel = model<ISession>('Session', sessionSchema)


