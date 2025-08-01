import { FastifyReply, FastifyRequest } from 'fastify';
// import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import { log, write as print } from '../business.logic/logging';
import { BookmarkModel } from '../model/bookmark';
import { IBookmarkPut } from '../schema/bookmarks';
import { MSG_500_ERROR_MESSAGE } from '../constants';

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
    // await connect(DB_URI)
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      request.params.id,
      { ...attributes, modified_at: new Date() },
      { new: true }
    );
    // await disconnect()
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
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}
