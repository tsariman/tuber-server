// import { FastifyReply, FastifyRequest } from 'fastify';
// import { IBookmarkPost } from '../schema/bookmarks';
// import Config from '../config';
// import { MSG_500_ERROR_MESSAGE } from '../constants';
// import {
//   default_500_error_response
// } from 'src/business.logic/jsonapi.error.builder';

// export default async function post_bookmarks_votes_endpoint (
//   req: FastifyRequest<IBookmarkPost>,
//   reply: FastifyReply
// ) {
//   try {
//     Config.print(`[DEBUG] User ... `);
//     const attributes = req.body.data.attributes;
//     const bookmark = await fix_missing_bookmark_data(attributes);
//     if (!bookmark) {
//       Config.log('Failed.');
//       reply.code(400).send(default_400_error_response({
//         title: 'Failed to create bookmark vote.',
//         detail: 'Bookmark is null.'
//       }));
//       return;
//     }
//     const dbBookmark = await create_bookmark(bookmark);
//     Config.log('Done.');
//     Config.log('[DEBUG] Sending response...', dbBookmark);
//     reply.code(201).send(
//       new JsonapiResponseBuilder(dbBookmark, 'bookmarks', 'object')
//       .mPaginationV2build()
//     );
//   } catch (e) {
//     Config.log(MSG_500_ERROR_MESSAGE, e);
//     reply.code(500).send(default_500_error_response(e));
//   }
// }
