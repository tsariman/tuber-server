import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, { default_500_error_response } from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseColBuilder from '../business.logic/builder/jsonapi.response.col.builder';
import { ler, log, log_err, write as print } from '../utility/logging';
import { get_bookmark_by_id } from '../model/bookmark';
import { IBookmarkGet } from '../schema/bookmarks';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function get_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    print(`[DEBUG] Getting bookmark with id '${request.params.id}'... `);
    const bookmark = await get_bookmark_by_id(request.params.id);
    if (bookmark) {
      log('Done.');
      reply.code(200).send(
        new JsonapiResponseColBuilder(bookmark, 'bookmarks', 'object').mPaginationV2build()
      );
    } else {
      log('Failed.\nBookmark not found.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail(`Bookmark with id '${request.params.id}' not found.`)
        .build()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('GET bookmark by id', e);
    reply.code(500).send(default_500_error_response(e));
  }
}