import { FastifyReply, FastifyRequest } from 'fastify';
import JsonapiErrorBuilder, {
  default_500_error_response
} from 'src/business.logic/builder/jsonapi.error.builder';
import { log, write as print } from '../../config';
import { get_video_thumbnail_url } from '../all.drivers';
import { BookmarkModel, get_bookmark_by_id } from 'src/model/bookmark';
import { IBookmark } from 'src/schema/bookmarks';
import { TPlatform } from 'src/common.types';
import JsonapiResponseBuilder from 'src/business.logic/builder/jsonapi.response.builder';

export interface IBookmarkThumbnailUrlGet {
  Params: {
    id?: string;
  };
}

const jsonapi_400_reply = () => new JsonapiErrorBuilder()
  .withStatus(400)
  .withCode('bad_request')
  .withTitle('Missing required information')
  .build();

export default async function get_video_thumbnail_url_endpoint (
  req: FastifyRequest<IBookmarkThumbnailUrlGet>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;
    if (!id) {
      log('[ERROR][400] get platform video thumbnail url');
      log('             Bookmark id is missing.');
      reply.code(400).send(jsonapi_400_reply());
      return;
    }
    print('[DEBUG] Retrieving bookmark... ');
    const bookmark = await get_bookmark_by_id(id);
    if (!bookmark) {
      log('Failed.\nBookmark not found.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Bookmark not Found')
        .build()
      );
      return;
    }
    log('Done.');
    if (bookmark.thumbnail_url) {
      log('[DEBUG] Bookmark already has a thumbnail url.');
      log('[DEBUG] thumbnail_url:', bookmark.thumbnail_url);
      reply.code(200).send(
        new JsonapiResponseBuilder(bookmark, 'bookmarks', 'object')
          .mPaginationV2build()
      );
      return;
    }
    const platform: TPlatform = bookmark.platform as TPlatform;
    const { videoid, slug, url } = bookmark as IBookmark;
    if (!platform) {
      log('[ERROR][400] get platform video thumbnail url');
      log('             Platform is missing. (bookmark.platform)'
                              + 'a sign of an invalid bookmark.');
      reply.code(400).send(jsonapi_400_reply());
      return;
    };
    if (!videoid && (platform === 'twitch' || platform === 'vimeo')) {
      log('[ERROR][500] get platform video thumbnail url');
      log('             Invalid bookmark. Video id is missing. (bookmark.videoid)');
      reply.code(500).send(default_500_error_response({
        message: 'Failed to retrieve thumbnail url.',
        stack: 'Existing bookmark is missing required information.'
      }));
      return;
    };
    if (!slug && (platform === 'rumble' || platform === 'odysee')) {
      log('[ERROR][500] get platform video thumbnail url');
      log('             Invalid bookmark. Slug is missing. (bookmark.slug)');
      reply.code(500).send(default_500_error_response({
        message: 'Failed to retrieve thumbnail url.',
        stack: 'Existing bookmark is missing required information.'
      }));
      return;
    }
    print(`[DEBUG] Retrieving ${platform}'s video thumbnail url... `);
    const thumbnail_url = await get_video_thumbnail_url({
      platform,
      videoid,
      slug,
      url
    });
    if (!thumbnail_url) {
      log(`Failed.`);
      reply.code(500).send(default_500_error_response({
        message: `Failed to retrieve video's thumbnail url.`,
        stack: `Failed to retrieve video's thumbnail url.`
      }));
      return;
    }
    log('Done.');
    log('[DEBUG] thumbnail_url:', thumbnail_url);
    print('[DEBUG] Updating bookmark... ');
    const updatedBookmark = await BookmarkModel.findByIdAndUpdate( // Update bookmark with thumbnail url
      id,
      { thumbnail_url },
      { new: true }
    );
    if (updatedBookmark) {
      log('Done.');
      reply.code(200).send(
        new JsonapiResponseBuilder(updatedBookmark, 'bookmarks', 'object')
          .mPaginationV2build()
      );
    } else {
      // [TODO] [HACK] Not finding the bookmark is not just an error but a hack
      //               attempt. Log this.
      log('Failed.\nBookmark not found.');
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail('Bookmark not found')
        .build()
      );
    }
  } catch (e) {
    log(`Failed.\n[ERROR][500] get platform video thumbnail url`, e);
    reply.code(500).send(default_500_error_response(e));
  }
}