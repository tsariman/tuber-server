import type { TContextualUser } from '../../schema/user'
import JsonapiErrorBuilder from '../builder/JsonapiErrorBuilder'
import Access from './Access'

export const BOOKMARK_NOTE_LINK_REGEX = /\[[^\]]+\]\((?:[^)\s]+)(?:\s+"[^"]*")?\)|\b(?:https?:\/\/|www\.)\S+/i

export const BOOKMARK_NOTE_LINKS_TITLE = 'Note links require a member account'
export const BOOKMARK_NOTE_LINKS_DETAIL = 'Please upgrade your account to member or above to include links in bookmark notes.'
export const BOOKMARK_NOTE_LINKS_FIELD_MESSAGE = 'Links in notes are available to member accounts and above.'
export const BOOKMARK_NOTE_LINKS_HELPER_TEXT = 'Upgrade to member or above to include links in bookmark notes.'

export const bookmark_note_contains_link = (note: unknown): note is string => {
  return typeof note === 'string' && BOOKMARK_NOTE_LINK_REGEX.test(note)
}

export const validate_bookmark_note_link_access = (
  note: unknown,
  usr?: TContextualUser
) => {
  if (!bookmark_note_contains_link(note) || Access.the(usr).can('bookmark.note.links')) {
    return null
  }

  return new JsonapiErrorBuilder()
    .withStatus(403)
    .withCode('VALIDATION_ERROR')
    .withTitle(BOOKMARK_NOTE_LINKS_TITLE)
    .withDetail(BOOKMARK_NOTE_LINKS_DETAIL)
    .withSource({ pointer: '/note' })
    .build()
}