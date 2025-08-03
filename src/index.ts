import mongoose from 'mongoose';
import appPromise from './app';
import Config from './config';
import { DEV_DEFAULT_USER, DEV_USER } from './DEV/dev.install.common';
// import start_cron_jobs from './cron.jobs'
import {  configuration_get_all } from './model/configuration';
import { find_index_by_name } from './business.logic/network';
import { readable_get_all } from './model/readable';
import { create_user } from './model/user';
import { COLLECTION_NAME } from './constants.server';
import { log, write as print, log_err, ler } from './utility/logging';

mongoose.set('strictQuery', false);

async function startServer() {
  const app = await appPromise;
  
  app.listen({ port: Config.FASTIFY_PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  process.stdout.write(`[INFO] 🚀 tuber server running at ${address}\n\n`);
  process.stdout.write(`[INFO] process.env.NODE_ENV = ${process.env.NODE_ENV}\n`);
  log(`[INFO] Config.DEV = ${Config.DEV}`);
  print('\n -------------------------------- \n');
  print('\n |     APP IS IN DEBUG MODE     | \n');
  print('\n -------------------------------- \n');
  const DB_URI = Config.DB_REMOTE ? Config.DB_URI_REMOTE : Config.DB_URI_LOCAL;
  console.log('\n[INFO] Database URI:', DB_URI);

  const database = Config.DB_REMOTE // Config.DB_PROTOCOL.slice(-6) === 'srv://'
    ? 'Atlas'
    : 'Mongodb';
  process.stdout.write(`\n[INFO] Connecting to ${database}... `);

  // Note: Use '127.0.0.1' instead of 'localhost' if connecting locally.
  mongoose.connect(DB_URI).then(async () => {
    console.log('Success!');

    // If using Mongodb Atlas,
    if (database === 'Atlas') {
      process.stdout.write('\n[INFO] Checking bookmarks search index... ');
      const searchIndex = await find_index_by_name(
        Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
        COLLECTION_NAME
      );
      if (searchIndex) {
        console.log('Done.');
      } else {
        console.log('Failed.');
        print(`[DEBUG] Search index, '${Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME}'`);
        log(' not defined for current database.');
        log(`[DEBUG] Visit endpoint: /dev/setup-collection-index-search/bookmarks`);
        log('[DEBUG] OR');
        log(`[DEBUG] Visit endpoint: /install/setup-collection-index-search/bookmarks`);
      }
    }

    // Check if dev user exists
    if (Config.DEV) {
      const devUser = await DEV_USER.findOne({ name: DEV_DEFAULT_USER.name });
      console.log('');
      if (devUser) {
        log('[DEBUG] "Dev user" is available.\n');
        Config.write('dev_user_available', true);
      } else {
        Config.write('dev_user_available', false);
        log('[DEBUG] Dev user is not available.\n');
      }
    }

    // Check if any users exist and create default admin if none found
    process.stdout.write('[INFO] Checking for existing users... ');
    const userCount = await DEV_USER.countDocuments();
    if (userCount === 0) {
      console.log('None found.');

      // Only create default user in debug mode
      if (Config.DEBUG) {
        process.stdout.write('[INFO] Creating default admin user... ');
        try {
          await createDefaultAdminUser();
          console.log('Success!');
          log('[INFO] Default admin user created with username: "admin"');
          log('[INFO] Default password: "admin123" (Please change this!)');
        } catch (error) {
          console.log('Failed!');
          ler('[ERROR] Failed to create default admin user:', error);
        }
      } else {
        log('[INFO] App not in debug mode. Skipping default user creation.');
        log('[INFO] To create a default user, enable debug mode or use the dev endpoints.');
      }
    } else {
      console.log(`Found ${userCount} user(s).`);
    }

    // Load configuration values from database in Config object.
    process.stdout.write('[INFO] Loading configuration from database... ');
    const dbConfigs = await configuration_get_all();
    if (dbConfigs.length > 0) {
      await Config.load(dbConfigs);
      console.log('Done.');
    } else {
      console.log('Failed. No configuration found in database.');
    }

    // Load readable text, if any, from the database into the readable cache.
    process.stdout.write('[INFO] Loading readables from the database... ');
    const dbReadables = await readable_get_all();
    if (dbReadables.length <= 0) {
      console.log('Failed.');
    } else {
      dbReadables.forEach(doc => Config.READABLE_CACHE.set(doc.key, doc.text));
      console.log('Done.');
    }
  
    // TODO - Uncomment this to start cron jobs.
    // process.stdout.write('Setting up cron jobs... ')
    // start_cron_jobs()
    // console.log('Done.')
  }, err => {
    if (Config.DEBUG) {
      console.error(`Failed.`, err);
    } else {
      console.log(`Failed. ${err.message}\n`);
    }
    process.exit(1);
  })

});

}

// Start the server
startServer().catch(error => {
  log_err('Failed to start server', error);
  process.exit(1);
});

/**
 * Creates a default admin user when no users exist in the database.
 * This ensures there's always a way to access the system.
 */
async function createDefaultAdminUser() {
  const defaultAdmin = {
    name: 'admin',
    email: 'admin@tuberesearcher.local',
    password: 'admin123', // This will be hashed by create_user
    role: 'administrator' as const,
    firstname: 'System',
    lastname: 'Administrator'
  };

  const user = await create_user(defaultAdmin);
  return user;
}
