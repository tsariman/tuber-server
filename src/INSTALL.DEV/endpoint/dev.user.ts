import { FastifyReply, FastifyRequest } from 'fastify'
import { existsSync } from 'fs'
import { connect, disconnect } from 'mongoose'
import * as fs from 'fs/promises'
import { IUser } from 'src/schema/users'
import { defaultDialogAlertJson as alert } from 'src/state/dialogs'
import C from 'src/config'
import {
  DEV_DEFAULT_USER,
  DEV_DEFAULT_USER_PWD,
  DEV_USER,
  DEV_USER_FILENAME,
  devGetHashedDefaultUsrPwd
} from '../dev.install.common'

export default async function dev_create_update_dev_user (
  _request: FastifyRequest,
  reply: FastifyReply
) {
  // [TODO] #1 Implement a system that notify of completed tasks without reloading the page.  

  // [TODO] #2   Check if the database already has a admin account.
  // [TODO] #2.1 Retrieve the developer user _id which was saved in a file.
  //             The name of the file is the md5 hash of
  //             "_id of developer user" which becomes
  //             "d1684a88be5c08aed50f565d9c8063ca.txt"
  try {
    if (existsSync(DEV_USER_FILENAME)) {
      const buffer = await fs.readFile(DEV_USER_FILENAME)
      const id = buffer.toString()
      if (id) {
        await connect(C.DB_URL)
        // [TODO] #3 If the developer user exist, reset the password and push
        //        a notification that indicates that the password was
        //        resetted along with the password itself.
        await DEV_USER.updateOne(
          { id },
          { password: await devGetHashedDefaultUsrPwd() }
        ).then(() => {
          C.log('Default dev password resetted. \n')
          C.log(`Password is '${DEV_DEFAULT_USER_PWD}' \n`)
        })
        await disconnect()
        reply.send(alert('Default dev password resetted.'))
      }
    } else {
      // #4 If the default dev user does not exist in the database, create it.
      createDefaultUser().catch(err => C.log(err))
      reply.send(alert('Default dev user created successfully.'))
    }
  } catch (e) { C.log(e) }

  /** Creates the default dev user. */
  async function createDefaultUser() {
    await connect(C.DB_URL)
    // https://mongoosejs.com/docs/typescript.html#creating-your-first-document
    const password = await devGetHashedDefaultUsrPwd()
    const devUser: IUser = { ...DEV_DEFAULT_USER, password }
    const user = new DEV_USER(devUser)
    await user.save().then(user => {
      C.log('Default dev user created successfully. \n')
      C.log(`Password='${DEV_DEFAULT_USER_PWD}' \n`)
      fs.writeFile(DEV_USER_FILENAME, user.id).catch(err => {
        if (C.DEBUG) {
          process.stdout.write(`Failed to save ${DEV_USER_FILENAME}. \n`)
          console.error(err)
        }
      })
    })
    await disconnect()
  }

}