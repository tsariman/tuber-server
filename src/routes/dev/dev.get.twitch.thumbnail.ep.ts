import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder';
import { default_500_error_response } from '../../business.logic/errors'
import { twitch_fetch_thumbnail_url } from '../../platform/twitch';
import { $46_STATE_KEY, MSG_500_ERROR_MESSAGE } from '@tuber/shared';
import { log } from '../../utility/logging';

export default async function dev_get_twitch_thumbnail_endpoint(
  req: FastifyRequest<{ Querystring: { videoid?: string }}>,
  reply: FastifyReply
) {
  const videoid = req.query.videoid;
  if (!videoid) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .withCode('MISSING_DATA')
      .withStatus(400)
      .withTitle('Query parameter is required')
      .build()
    );
    return;
  }
  try {
    const thumbnailUrl = await twitch_fetch_thumbnail_url(videoid);
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
        .withDetail('Check the video ID and try again.')
        .build()
      );
    }
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}
