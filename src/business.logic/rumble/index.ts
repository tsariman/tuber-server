import { RUMBLE_URL } from '../../constants'
import { IBookmark } from '../../schema/bookmarks'
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
      /<meta property="og:image" content="(.+?)">/
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

export async function rumble_fetch_thumbnail(slug: string): Promise<string|false> {
  const urlObj = new URL(`${RUMBLE_URL}${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`
  const response = await fetch(compliantUrl)
  const htmlText = await response.text()
  const matches = htmlText.match(
    /<meta property="og:image" content="(.+?)">/
  ) ?? []
  const [ m2, thumbnail_url ] = matches
  if (m2 && thumbnail_url) {
    return thumbnail_url
  }
  return false
}