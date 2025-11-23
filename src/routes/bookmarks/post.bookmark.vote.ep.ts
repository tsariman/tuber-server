// import { FastifyReply, FastifyRequest } from 'fastify';
// import { IBookmarkPost } from '../schema/bookmarks';
// import { log, write as print } from '../utility/logging';
// import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';
// import {
//   default_500_error_response
// } from '../business.logic/jsonapi.error.builder';

// export default async function post_bookmarks_votes_endpoint (
//   req: FastifyRequest<IBookmarkPost>,
//   reply: FastifyReply
// ) {
//   try {
//     print(`[DEBUG] User ... `);
//     const attributes = req.body.data.attributes;
//     const bookmark = await fix_missing_bookmark_data(attributes);
//     if (!bookmark) {
//       log('Failed.');
//       reply.code(400).send(default_400_error_response({
//         title: 'Failed to create bookmark vote.',
//         detail: 'Bookmark is null.'
//       }));
//       return;
//     }
//     const dbBookmark = await create_bookmark(bookmark);
//     log('Done.');
//     log('[DEBUG] Sending response...', dbBookmark);
//     reply.code(201).send(
//       JsonapiResponseBuilder.forSingleResource(dbBookmark, 'bookmarks')
//       .build()
//     );
//   } catch (e) {
//     ler(MSG_500_ERROR_MESSAGE);
//     log_err('POST bookmark vote', e);
//     reply.code(500).send(default_500_error_response(e));
//   }
// }
