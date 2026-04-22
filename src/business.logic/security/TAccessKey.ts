/**
 * Union of possible actions needing access privilege
 * TODO - Add more actions as their required clearance here.
 */
export type TAccessKey = 'dev_install_page.view'
  | 'create.bookmark'
  | 'bookmark.note.links'
  | 'read.all.unpublished.bookmark'
  | 'read.user.collection'
  | 'get.user'
  | 'user.get'
  | 'bookmark.publish'
  | 'bookmark.moderate'
  | 'user.admin'
  | 'system.developer'
  | 'toggle.search.scope'
  | 'publish.bookmark'
  | 'publish.unknown.bookmark'
