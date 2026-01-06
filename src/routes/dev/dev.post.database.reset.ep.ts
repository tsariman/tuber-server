import { FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { alertResponse as alert } from '../../state/dialog';
import mongoose from 'mongoose';
import { DEV_USER_FILENAME } from '../../dev/dev.install.common';
import { log, ler } from '../../utility/logging';

export default async function dev_post_database_reset_endpoint (
  _request: FastifyRequest,
  reply: FastifyReply
) {
  mongoose.set('strictQuery', true);
  let error: unknown;
  await devDropDatabase().catch(err=>{error=err;});
  if (existsSync(DEV_USER_FILENAME)) {
    fs.unlink(DEV_USER_FILENAME).catch(e => ler(e)); // delete dev user file
  }
  if (!error) {
    reply.send(alert('The database was successfully deleted!'));
  } else {
    ler(error);
  }
  async function devDropDatabase() {
    await mongoose.connection.db?.dropDatabase().then(() => {
      log('[REQUEST] Database was dropped.');
    });
  }
}
