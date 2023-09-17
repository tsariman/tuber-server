/* Use mongoose to create and populate the development database.
   Create the database
   Create the user collection
   Create the admin user */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import dev_create_update_dev_user from './endpoint/dev.user'
import dev_database_reset from './endpoint/dev.database.reset'
import { dev_load_test_drawer, dev_unload_test_drawer } from './endpoint'
import { DEFAULT_OPTIONS } from 'src/middleware/router.option'
import { dev_populate_notes, dev_populate_users } from './endpoint/dev.populate.collections'
import Config from 'src/config'
import { limit_array, ms_to_seconds } from 'src/business.logic'
import mongoose, { connect, disconnect } from 'mongoose'
import {
  defaultDialogAlertJson as alert,
  dialogAlertJson as dialogAlert
} from 'src/state/dialogs'
import { UserPaginationModel } from 'src/model/user'
import gen_random_users from './population/users'
import { NotePaginationModel } from 'src/model/note'
import gen_random_notes from './population/notes'

interface IDevPopulateEndpoint {
  Params: {
    total: string
  }
}

type TDevHandRequest = FastifyRequest<{
  Params: {
    hangTime: string
  }
}>

const opts = {
  ...DEFAULT_OPTIONS,
  // TODO Add custom route options here
}

export default async function dev_install_controller(fastify: FastifyInstance) {

  fastify.get('/', opts, async function (
    _request: FastifyRequest,
    _reply: FastifyReply
  ) {

  })

  // Creates the default user for development purposes.
  fastify.post('/user', dev_create_update_dev_user)
  // Reset the database for development purposes.
  fastify.post('/database-reset', dev_database_reset)
  // Adds the test drawer to client side.
  fastify.post('/load-test-drawer', dev_load_test_drawer)
  // Removes the test drawer from client side.
  fastify.post('/unload-test-drawer', dev_unload_test_drawer)
  // Populates the users collection with random data.
  fastify.post<IDevPopulateEndpoint>(
    '/populate/users/:total',
    dev_populate_users
  )
  // Populates the notes collection with random data.
  fastify.post<IDevPopulateEndpoint>(
    '/populate/notes/:total',
    dev_populate_notes
  )
  // No response endpoint for testing purposes.
  fastify.get('/no-response/:hangTime', {
  }, async function (
    request: TDevHandRequest,
    _reply: FastifyReply
  ) {
    const hangTime = parseInt(request.params.hangTime) || 5000
    Config.log('Hanging endpoint called for', ms_to_seconds(hangTime))
    let loopForever = true
    setTimeout(() => {
      loopForever = false
    }, hangTime)
    while (loopForever) {
      await new Promise(resolve => setTimeout(resolve, hangTime))
    }
  })
  // Drops a collection from the database.
  fastify.delete('/drop-collection/:collection', {}, async function (
    req: FastifyRequest<{ Params: { collection: string } }>,
    reply: FastifyReply
  ) {
    const { collection } = req.params
    Config.print(`Dropping '${collection}' collection... `)
    await connect(Config.DB_URL)
    await mongoose.connection.db.dropCollection(collection)
    Config.log('done!')
    const devInstallForm = {
      'noteCount': await NotePaginationModel.countDocuments(),
      'userCount': await UserPaginationModel.countDocuments()
    }
    await disconnect()
    reply.send({
      'state': {
        'dialog': dialogAlert(`Dropped '${collection}' collection!`),
        'pagesData': {
          'devInstallForm': devInstallForm
        }
      }
    })
  })
  // Populate a collection with random data.
  fastify.post('/populate-collection', {}, async function (
    req: FastifyRequest<{ Body: { collection: string, quantity: string } }>,
    reply: FastifyReply
  ) {
    const { collection, quantity } = req.body
    Config.print(`Populating '${collection}' collection with ${quantity} documents... `)
    const number = parseInt(quantity, 10)
    await connect(Config.DB_URL)
    switch (collection) {
      case 'users':
        try {
          limit_array( // Prevent overloading the client with too many users
            await UserPaginationModel.insertMany(gen_random_users(number)),
            parseInt(Config.PAGINATION_USERS_LIMIT)
          )
          const userCount = await UserPaginationModel.countDocuments()
          await disconnect()
          Config.log('done!')
          reply.send({
            'state': {
              'dialog': dialogAlert(`Populated '${collection}' collection with ${quantity} documents!`),
              'pagesData': {
                'devInstallForm': {
                  'userCount': userCount
                }
              }
            }
          })
        } catch (err) {
          Config.log('failed!')
          Config.log(err)
          reply.send(alert(`Failed to populate '${collection}' collection with ${quantity} documents!`))
        }
        return
      case 'notes':
        try {
          limit_array( // Prevent overloading the client with too many notes
            await NotePaginationModel.insertMany(gen_random_notes(number)),
            parseInt(Config.PAGINATION_NOTES_LIMIT)
          )
          const noteCount = await NotePaginationModel.countDocuments()
          await disconnect()
          Config.log('done!')
          reply.send({
            'state': {
              'dialog': dialogAlert(`Populated '${collection}' collection with ${quantity} documents!`),
              'pagesData': {
                'devInstallForm': {
                  'noteCount': noteCount
                }
              }
            }
          })
        } catch (err) {
          Config.log('failed!')
          Config.log(err)
          reply.send(alert(`Failed to populate '${collection}' collection with ${quantity} documents!`))
        }
        return
      default:
        Config.log('failed!')
        reply.send(alert(`Collection '${collection}' not found!`))
        return
    }
  })
}
