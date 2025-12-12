import { FastifyRequest } from 'fastify'
import { IBookmark } from '../../schema/bookmark'
import { TPlatform } from '../../common.types'
import RequestDataValidator from '../../business.logic/RequestDataValidator'
import editDailyBookmarkFormState from '../../state/form/edit.daily.bookmark.form.state'
import editFacebookBookmarkFormState from '../../state/form/edit.facebook.bookmark.form.state'
import editOdyseeBookmarkFormState from '../../state/form/edit.odysee.bookmark.form.state'
import editRumbleBookmarkFormState from '../../state/form/edit.rumble.bookmark.form.state'
import editTwitchBookmarkFormState from '../../state/form/edit.twitch.bookmark.form.state'
import editUnknownBookmarkFormState from '../../state/form/edit.unknown.bookmark.form.state'
import editVimeoBookmarkFormState from '../../state/form/edit.vimeo.bookmark.form.state'
import editYouTubeBookmarkFormState from '../../state/form/edit.youtube.bookmark.form.state'

/**
 * Get a query parameter from a request.
 *
 * @param req 
 * @param includeQm whether to include the question mark in the returned string
 * @returns string
 */
export function get_raw_query(req: FastifyRequest, includeQm = false): string {
  const query = req.raw.url?.split('?')[1]
  if (!query) return ''
  return includeQm ? `?${query}` : query
}

export const get_platform_specific_validator = (bookmark: IBookmark,
  platform: TPlatform
): RequestDataValidator<IBookmark> | null => {
  switch (platform) {
    case '_blank':
    case 'bitchute':
    default:
      return null
    case 'dailymotion':
      return new RequestDataValidator(bookmark, editDailyBookmarkFormState)
    case 'facebook':
      return new RequestDataValidator(bookmark, editFacebookBookmarkFormState)
    case 'odysee':
      return new RequestDataValidator(bookmark, editOdyseeBookmarkFormState)
    case 'rumble':
      return new RequestDataValidator(bookmark, editRumbleBookmarkFormState)
    case 'twitch':
      return new RequestDataValidator(bookmark, editTwitchBookmarkFormState)
    case 'unknown':
      return new RequestDataValidator(bookmark, editUnknownBookmarkFormState)
    case 'vimeo':
      return new RequestDataValidator(bookmark, editVimeoBookmarkFormState)
    case 'youtube':
      return new RequestDataValidator(bookmark, editYouTubeBookmarkFormState)
  }
}