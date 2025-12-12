/** Union of possible actions needing access privilege */
export type TAccessKey = 'dev_install_page.view'
  | 'read.user.collection'
  | 'get.user'
  | 'read.unpublished.bookmark'
  | 'user.get'
  | 'bookmark.publish'
  | 'bookmark.moderate'
  | 'user.admin'
  | 'system.developer'

  // TODO: Add more actions are their required clearance here.