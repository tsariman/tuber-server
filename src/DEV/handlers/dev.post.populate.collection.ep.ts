import { FastifyReply, FastifyRequest } from 'fastify';
import Config from '../../config';
import { limit_array } from '../../business.logic';
import { UserPaginationModel } from '../../model/user';
import gen_random_users from '../population/users';
import { BookmarkPaginationModel } from '../../model/bookmark';
import gen_random_bookmarks from '../population/bookmarks';
import {
  defaultDialogAlertState as alert,
  dialogAlertState as dialogAlert
} from '../../state/dialog';
import { log, write as print } from '../../utility/logging';

export default async function dev_post_populate_collection_endpoint (
  req: FastifyRequest<{ Body: { collection: string, quantity: string }}>,
  reply: FastifyReply
) {
  const { collection, quantity } = req.body;
  print(`[DEBUG] Populating '${collection}' collection with ${quantity} documents... `);
  const number = parseInt(quantity, 10);
  switch (collection) {
    case 'users':
      try {
        limit_array( // Prevent overloading the client with too many users
          await UserPaginationModel.insertMany(gen_random_users(number)),
          parseInt(Config.PAGINATION_USERS_LIMIT)
        );
        const userCount = await UserPaginationModel.countDocuments();
        log('Done.');
        reply.send({
          'state': {
            'dialog': dialogAlert(`Populated '${collection}' collection with ${quantity} documents!`),
            'pagesData': {
              'devInstallForm': {
                'userCount': userCount
              }
            }
          }
        });
      } catch (err) {
        log('Failed.', err);
        reply.send(alert(`Failed to populate '${collection}' collection with ${quantity} documents!`));
      }
      return;
    case 'bookmarks':
      try {
        limit_array( // Prevent overloading the client with too many bookmarks
          await BookmarkPaginationModel.insertMany(gen_random_bookmarks(number)),
          parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)
        );
        const bookmarkCount = await BookmarkPaginationModel.countDocuments();
        log('Done.');
        reply.send({
          'state': {
            'dialog': dialogAlert(`Populated <span style="color:#3399ff">${collection}</span> collection with ${quantity} documents!`),
            'pagesData': {
              'devInstallForm': {
                'bookmarkCount': bookmarkCount
              }
            }
          }
        });
      } catch (err) {
        log('Failed.', err);
        reply.send(alert(`Failed to populate '${collection}' collection with ${quantity} documents!`));
      }
      return;
    default:
      log('Failed.');
      reply.send(alert(`Collection '${collection}' not found!`));
      return;
  }
}