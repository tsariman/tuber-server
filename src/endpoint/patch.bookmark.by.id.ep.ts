import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/JsonapiErrorBuilder';
import { ler, log, log_err, write as print } from '../utility/logging';
import { update_bookmark_by_id } from '../model/bookmark';
import { IBookmarkPatch } from '../schema/bookmarks';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';

export default async function patch_bookmark_by_id_endpoint (
  request: FastifyRequest<IBookmarkPatch>,
  reply: FastifyReply
) {
  try {
    print('[DEBUG] Updating bookmark... ');
    // [TODO] Validate request body (request.body.data.attributes)
    //        video_id, platform, start_seconds, title are required
    const attributes = request.body?.data?.attributes;
    if (!attributes) {
      log('Failed.\n[DEBUG][400] Missing attributes.', request.body);
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('bad_request')
        .withTitle('Bad Request')
        .withDetail('Missing attributes')
        .build()
      );
      return;
    }
    const bookmark = await update_bookmark_by_id(request.params.id, attributes);
    if (bookmark) {
      log('Done.');
      reply.code(204).send();
    } else {
      log('Failed.\n[DEBUG][404] Bookmark not found.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('not_found')
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .withSource({ parameter: request.params.id })
        .build()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('PUT user by id', e);
    reply.code(500).send(default_500_error_response(e));
  }
}
