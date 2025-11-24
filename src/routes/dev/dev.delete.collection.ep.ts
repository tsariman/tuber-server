import { FastifyReply, FastifyRequest } from 'fastify'
import { task, task_end } from '../../utility/logging'
import mongoose from 'mongoose'
import { BookmarkPaginationModel } from '../../model/bookmark'
import { UserPaginationModel } from '../../model/user'
import { dialogAlertState as dialogAlert } from '../../state/dialog'

export default async function dev_delete_collection_endpoint (
  req: FastifyRequest<{ Params: { collection: string }}>,
  reply: FastifyReply
) {
  const { collection } = req.params
  task(`Dropping '${collection}' collection... `)
  await mongoose.connection.db?.dropCollection(collection)
  task_end('Done.')
  const devInstallForm = {
    'bookmarkCount': await BookmarkPaginationModel.countDocuments(),
    'userCount': await UserPaginationModel.countDocuments()
  }
  reply.send({
    'state': {
      'dialog': dialogAlert(`Dropped '${collection}' collection!`),
      'pagesData': {
        'devInstallForm': devInstallForm
      }
    }
  })
}