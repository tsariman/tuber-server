import { FastifyReply, FastifyRequest } from 'fastify'
import { ler, task } from '../../utility/logging'
import mongoose from 'mongoose'
import { BookmarkModel } from '../../model/bookmark'
import { UserModel } from '../../model/user'
import { alertDialogState as dialogAlert } from '../../state/dialog'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { error_id } from '../../business.logic/errors'
import { to_error_object } from '../../utility'

export default async function dev_delete_collection_endpoint (
  req: FastifyRequest<{ Params: { collection?: string }}>,
  reply: FastifyReply
) {
  try {
    task('Checking collection name ')
    const { collection } = req.params
    if (!collection) {
      task.end('[❌]')
      throw new Error('No collection specified')
    }
    task.end('[✔️]')
    task(`Dropping '${collection}' collection `)
    const dropResult = await mongoose.connection.db?.dropCollection(collection)
    if (!dropResult) {
      throw new Error(`Failed to drop collection: ${collection}`)
    }
    task.end('[✔️]')
    const bookmarkCount = await BookmarkModel.countDocuments()
    const userCount = await UserModel.countDocuments()
    const devInstallForm = { bookmarkCount, userCount }
    reply.send({
      'state': {
        'dialog': dialogAlert(`Dropped '${collection}' collection!`),
        'pagesData': { devInstallForm }
      }
    } as TJsonapiStateResponse)
  } catch (e) {
    const error = to_error_object(e)
    ler(`${MSG_500_ERROR_MESSAGE} - ${error.message}`)
    error_id(50051).default_500_error_response(e)
  }
}
