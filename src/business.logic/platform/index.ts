import { IBookmark } from '../../schema/bookmarks'
import { RUMBLE_URL } from '../../constants'
import C from '../../config'

export async function rumble_fix_missing_data(bookmark: IBookmark): Promise<IBookmark|false> {
  // Get rumble video id
  if (bookmark.slug) {
    const url = new URL(`${RUMBLE_URL}${bookmark.slug}.html`)

    // Had to get rid of query string because it was causing errors.
    const compliantUrl = url.origin + url.pathname

    const response = await fetch(compliantUrl)
    const htmlText = await response.text()
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