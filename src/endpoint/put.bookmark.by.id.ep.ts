import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import { ler, log, log_err, write as print } from '../utility/logging';
import { BookmarkModel } from '../model/bookmark';
import { IBookmarkPut } from '../schema/bookmarks';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function put_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkPut>,
  reply: FastifyReply
) {
  try {
    print('[DEBUG] Updating bookmark... ');
    // [TODO] Validate request body (request.body.data.attributes)
    //        video_id, platform, start_seconds, title are required
    const attributes = request.body?.data?.attributes;
    if (!attributes) {
      log('Failed.\nMissing attributes.', request.body);
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withTitle('Bad Request')
        .withDetail('Missing attributes')
        .build()
      );
      return;
    }
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      request.params.id,
      { ...attributes, modified_at: new Date() },
      { new: true }
    );
    if (bookmark) {
      log('Done.');
      reply.code(204).send();
    } else {
      log('Failed.\nBookmark not found.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .build()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('PUT user by id', e);
    reply.code(500).send(default_500_error_response(e));
  }
}
