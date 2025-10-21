import { FastifyReply, FastifyRequest } from 'fastify';
import {
  default_500_error_response
} from '../../business.logic/builder/JsonapiErrorBuilder';
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder';
import { log, write as print } from '../../utility/logging';
import { create_bookmark } from '../../model/bookmark';
import { IBookmarkPost } from '../../schema/bookmarks';
import { gen_random_bookmark_votes } from '..';
import fix_missing_bookmark_data from '../../platform/all.drivers';
import { MSG_500_ERROR_MESSAGE } from '../../constants.server';

export default async function dev_post_bookmarks_endpoint (
  req: FastifyRequest<IBookmarkPost>,
  reply: FastifyReply
) {
  try {
    const attr = req.body.data?.attributes;
    print(`[DEBUG] Creating [${attr?.platform}] bookmark... `);

    // Generate random votes for development purposes
    const attrWithVotes = gen_random_bookmark_votes(attr);
    const bookmark = await fix_missing_bookmark_data(attrWithVotes, req.usr);

    if (!bookmark) {
      log('Failed.');
      reply.code(500).send(default_500_error_response({
        title: 'Failed to create bookmark.',
        detail: 'Bookmark is null.'
      }));
      return;
    }
    const dbBookmark = await create_bookmark(bookmark);
    log('Done.');
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks').build()
    );
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}