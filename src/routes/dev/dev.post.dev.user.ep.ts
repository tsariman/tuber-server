import { FastifyReply, FastifyRequest } from 'fastify'
import { existsSync } from 'fs'
import * as fs from 'fs/promises'
import { IUser } from '../../schema/user'
import { alertResponse as alert } from '../../state/dialog'
import C from '../../config'
import {
  DEV_DEFAULT_USER,
  DEV_DEFAULT_USER_PWD,
  DEV_USER_FILENAME,
  devGetHashedDefaultUsrPwd
} from '../../dev/dev.install.common'
import { ler, log } from '../../utility/logging'
import { UserModel } from '../../model/user'

/** `POST /dev/dev-user` Creates the default developer user or resets its password if it already exists. */
export default async function dev_post_create_update_dev_user_endpoint (
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
        // await connect(C.DB_URI)
        // [TODO] #3 If the developer user exist, reset the password and push
        //        a notification that indicates that the password was
        //        resetted along with the password itself.
        const hashedPwd = await devGetHashedDefaultUsrPwd()
        await UserModel.updateOne(
          { id },
          { password: hashedPwd }
        ).then(() => {
          log('Default dev password resetted. \n')
          log(`Password is '${DEV_DEFAULT_USER_PWD}' \n`)
        })
        // await disconnect()
        reply.send(alert('Default dev password resetted.'))
      }
    } else {
      // #4 If the default dev user does not exist in the database, create it.
      createDefaultUser().catch(err => ler(err))
      reply.send(alert('Default dev user created successfully.'))
    }
  } catch (e) { log(e) }

  /** Creates the default dev user. */
  async function createDefaultUser() {
    // await connect(C.DB_URI)
    // https://mongoosejs.com/docs/typescript.html#creating-your-first-document
    const password = await devGetHashedDefaultUsrPwd()
    const devUser: IUser = { ...DEV_DEFAULT_USER, password }
    const user = new UserModel(devUser)
    await user.save().then(user => {
      log('Default dev user created successfully. \n')
      log(`Password='${DEV_DEFAULT_USER_PWD}' \n`)
      fs.writeFile(DEV_USER_FILENAME, user.id).catch(err => {
        if (C.DEBUG) {
          process.stdout.write(`Failed to save ${DEV_USER_FILENAME}. \n`)
          console.error(err)
        }
      })
    })
  }

}