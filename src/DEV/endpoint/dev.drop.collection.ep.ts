import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import mongoose from 'mongoose'
import { BookmarkPaginationModel } from '../../model/bookmark'
import { UserPaginationModel } from '../../model/user'
import {
  // defaultDialogAlertState as alert,
  dialogAlertState as dialogAlert
} from '../../state/dialog'

export default async function dev_drop_collection (
  req: FastifyRequest<{ Params: { collection: string } }>,
  reply: FastifyReply
) {
  const { collection } = req.params
  Config.print(`Dropping '${collection}' collection... `)
  // await connect(Config.DB_URI)
  await mongoose.connection.db.dropCollection(collection)
  Config.log('done!')
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