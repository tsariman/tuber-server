import { IBookmark } from '../schema/bookmarks'
import C from '../config'
import { TPlatform } from '../common.types'
import axios from 'axios'

/**
 * For the sake of organization, all platform URLs are located in one place.
 */
export const PLATFORM_URL: {[key in TPlatform]: string} = {
  _blank: '',
  youtube: 'https://www.youtube.com/',
  rumble: 'https://rumble.com/',
  odysee: 'https://odysee.com/',
  vimeo: 'https://vimeo.com/',
  dailymotion: 'https://www.dailymotion.com/',
  facebook: 'https://www.facebook.com/',
  bitchute: 'https://www.bitchute.com/',
  twitch: 'https://www.twitch.tv/',
  unknown: ''
}

export async function rumble_fix_missing_data(bookmark: IBookmark): Promise<IBookmark|false> {
  // Get rumble video id
  if (bookmark.slug) {
    const url = new URL(`${PLATFORM_URL['rumble']}${bookmark.slug}.html`)

    // Had to get rid of query string because it was causing errors.
    const compliantUrl = url.origin + url.pathname

    const response = await axios.get(compliantUrl)
    const htmlText = await response.data
    const videoIdMatches = htmlText.match(/"video":"(.*?)"/) ?? []
    const thumbnailUrlMatches = htmlText.match(
      /<meta property=og:image content=(.+?)>/
    ) ?? []
    const [ m2, thumbnail_url ] = thumbnailUrlMatches
    const [ m1, videoid ] = videoIdMatches
    if (m1 && m2 && videoid && thumbnail_url) {
      return {
        ...bookmark,
        videoid,
        thumbnail_url
      }
    } else {
      C.err(`failed to parse video ID from rumble url`, videoIdMatches)
    }
  }
  return false
}