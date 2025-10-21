import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/JsonapiErrorBuilder';
import { ler, log, log_err, write as print } from '../utility/logging';
import { BookmarkModel } from '../model/bookmark';
import { IBookmarkDelete } from '../schema/bookmarks';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function delete_bookmark_by_id_endpoint (
  req: FastifyRequest<IBookmarkDelete>,
  reply: FastifyReply
) {
  try {
    print('[DEBUG] Disabling bookmark... ');
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    if (bookmark) {
      log('Done.');
      reply.code(204).send();
    } else {
      log('Failed.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('not_found')
        .withTitle('Not Found')
        .withDetail(`Bookmark with id ${req.params.id} not found`)
        .build()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('DELETE bookmark by id', e);
    reply.code(500).send(default_500_error_response(e));
  }
}
