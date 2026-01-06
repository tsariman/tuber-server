import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import { limit_array } from '../../business.logic'
import { transform_user_doc, UserPaginationModel } from '../../model/user'
import gen_random_users from '../../dev/population/users'
import { BookmarkPaginationModel, transform_bookmark_doc } from '../../model/bookmark'
import gen_random_bookmarks from '../../dev/population/bookmarks'
import { alertResponse, alertDialogState, alertState } from '../../state/dialog'
import { errr, ler, task } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'

export default async function dev_post_populate_collection_endpoint (
  req: FastifyRequest<{ Body: { collection?: string, quantity?: string }}>,
  reply: FastifyReply
) {
  task('Checking population request parameters ')
  const { collection, quantity } = req.body
  const number = parseInt(quantity ?? '', 10)
  if (!collection || isNaN(number) || number <= 0) {
    task.end('[❌]')
    const message = 'Invalid collection name or quantity!'
    errr(message)
    reply.status(400).send(new JsonapiErrorBuilder()
      .withStatus(400)
      .withCode('BAD_VALUE')
      .withTitle('Bad Request')
      .withDetail(message)
      .withState(alertState(message))
      .build())
    return
  }
  task.end('[✔️]')
  task(`Populated '${collection}' collection with ${quantity} documents `)
  switch (collection) {
    case 'users':
      try {
        const rndUsers = gen_random_users(number)
        const inserted = await UserPaginationModel.insertMany(rndUsers)
        if (!inserted) { throw new Error('No users were inserted') }
        const dbUsers = limit_array( // Prevent overloading the client with too many users
          inserted,
          parseInt(Config.PAGINATION_USERS_LIMIT)
        )
        const userCount = await UserPaginationModel.countDocuments()
        if (!userCount) {
          throw new Error('Failed to count users after insertion')
        }
        const response = JsonapiResponseBuilder.forCollection()
          .withDocuments(dbUsers, 'users', transform_user_doc)
          .withCollectionPagination(userCount, 1, dbUsers.length)
          .withState({
            'dialog': alertDialogState(`Populated '${collection}' collection with ${quantity} documents!`),
            'pagesData': {
              'devInstallForm': { userCount }
            }
          })
          .build()
        task.end('[✔️]')
        reply.send(response)
      } catch (err) {
        ler(MSG_500_ERROR_MESSAGE, err)
        const message = `Failed to populate '${collection}' collection with ${quantity} documents!`
        reply.status(500).send(new JsonapiErrorBuilder()
          .withStatus(500)
          .withCode('INTERNAL_ERROR')
          .withTitle('Internal Server Error')
          .withDetail(message)
          .withState(alertState(message))
          .build())
      }
      return
    case 'bookmarks':
      try {
        const rndBookmarks = await gen_random_bookmarks(number)
        if (!rndBookmarks) {
          throw new Error('Failed to generate random bookmarks')
        }
        const inserted = await BookmarkPaginationModel.insertMany(rndBookmarks)
        if (!inserted) { throw new Error('No bookmarks were inserted') }
        const dbBookmarks = limit_array( // Prevent overloading the client with too many bookmarks
          inserted,
          parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)
        )
        const bookmarkCount = await BookmarkPaginationModel.countDocuments()
        if (!bookmarkCount) {
          throw new Error('Failed to count bookmarks after insertion')
        }
        const response = JsonapiResponseBuilder.forCollection()
          .withDocuments(dbBookmarks, 'bookmarks', transform_bookmark_doc)
          .withCollectionPagination(bookmarkCount, 1, dbBookmarks.length)
          .withState({
            'dialog': alertDialogState(`Populated <span style="color:#3399ff">${collection}</span> collection with ${quantity} documents!`),
            'pagesData': {
              'devInstallForm': { bookmarkCount }
            }
          })
          .build()
        task.end('[✔️]')
        reply.send(response)
      } catch (err) {
        ler(MSG_500_ERROR_MESSAGE, err)
        const message = `Failed to populate '${collection}' collection with ${quantity} documents!`
        reply.status(500).send(new JsonapiErrorBuilder()
          .withStatus(500)
          .withCode('INTERNAL_ERROR')
          .withTitle('Internal Server Error')
          .withDetail(message)
          .withState(alertState(message))
          .build())
      }
      return
    default:
      task.end('[❌]')
      reply.send(alertResponse(`Collection '${collection}' not found!`))
      return
  }
}