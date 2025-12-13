import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { $46_STATE_KEY, MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import { odysee_fetch_thumbnail_url } from '../../platform/odysee';
import { log } from '../../utility/logging';

/** 
 * Example URL: http://localhost:8080/dev/odysee/thumbnails?slug=<paste-slug-here>
 */
export default async function dev_get_odysee_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { slug?: string }}>,
  reply: FastifyReply
) {
  const slug = req.query.slug;
  if (!slug) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_DATA')
      .withStatus(400)
      .withTitle('Query parameter is required')
      .build()
    );
    return;
  }
  try {
    const thumbnailUrl = await odysee_fetch_thumbnail_url(slug);
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
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('not found')
        .withDetail('Check the slug and try again.')
        .build()
      );
    }
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}