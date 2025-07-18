import { FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import C from '../../config';
import { defaultDialogAlertState as alert } from '../../state/dialog';
import mongoose from 'mongoose';
// import { connect, disconnect } from 'mongoose';
import { DEV_USER_FILENAME } from '../dev.install.common';

export default async function dev_post_database_reset_endpoint (
  _request: FastifyRequest,
  reply: FastifyReply
) {
  mongoose.set('strictQuery', true);
  let error: unknown;
  await devDropDatabase().catch(err=>{error=err;C.log(err)});
  if (existsSync(DEV_USER_FILENAME)) {
    fs.unlink(DEV_USER_FILENAME).catch(e => C.log(e)); // delete dev user file
  }
  if (!error) {
    reply.send(alert('The database was successfully deleted!'));
  } else {
    C.log(error);
  }
  async function devDropDatabase() {
    // await connect(C.DB_URI)
    await mongoose.connection.db.dropDatabase().then(() => {
      C.log('[request] Database was dropped.');
    });
    // await disconnect()
  }
}
