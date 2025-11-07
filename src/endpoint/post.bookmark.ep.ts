import { FastifyReply, FastifyRequest } from 'fastify';
import {
  default_500_error_response,
  default_400_error_response
} from '../business.logic/builder/JsonapiErrorBuilder';
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder';
import { ler, log, log_err, write as print } from '../utility/logging';
import { create_bookmark } from '../model/bookmark';
import { IBookmarkPost } from '../schema/bookmarks';
import fix_missing_bookmark_data from '../platform/all.drivers';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver';

export default async function post_bookmark_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  try {
    const driver = new JsonapiRequestDriver(req.body);
    const platform = driver.getAttribute('platform');
    const attr = driver.getAttributes();
    print(`[DEBUG] Creating [${platform}] bookmark... `);
    const bookmark = await fix_missing_bookmark_data(attr, req.usr);
    if (!bookmark) {
      log('Failed.');
      reply.code(400).send(default_400_error_response({
        title: 'Failed to create bookmark.',
        detail: 'Bookmark is null.'
      }));
      return;
    }
    const dbBookmark = await create_bookmark(bookmark);
    log('Done.');
    log('[DEBUG] Sending response...', dbBookmark);
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks').build()
    );
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('POST bookmark', e);
    reply.code(500).send(default_500_error_response(e));
  }
}