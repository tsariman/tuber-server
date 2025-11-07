import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/builder/JsonapiErrorBuilder';
import { $46_STATE_KEY, MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import { rumble_fetch_thumbnail_url } from '../../platform/rumble';
import { log } from '../../utility/logging';

/** 
 * Example URL: http://localhost:8080/dev/rumble/thumbnails?slug=<paste-slug-here>
 */
export default async function dev_get_rumble_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { slug?: string }}>,
  reply: FastifyReply
) {
  const slug = req.query.slug;
  if (!slug) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('bad_request')
      .withStatus(400)
      .withTitle('Query parameter is required')
      .build()
    );
    return;
  }
  try {
    const thumbnailUrl = await rumble_fetch_thumbnail_url(slug);
    if (thumbnailUrl) {
      reply.code(200).send({
        'state': {
          'pagesData': {
            [$46_STATE_KEY]: { thumbnailUrl }
          }
        }
      });
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('not_found')
        .withStatus(404)
        .withTitle('Not found')
        .withDetail('Check the slug and try again.')
        .build()
      );
    }
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}