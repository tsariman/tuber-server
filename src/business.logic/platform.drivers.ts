import fetch from 'cross-fetch'
import { IBookmark } from '../schema/bookmarks'
import { TPlatform } from './common.types'
import C from '../config'
import { RUMBLE_URL } from '../constants'

export default async function fix_missing_bookmark_data (
  bookmark?: IBookmark
): Promise<IBookmark|undefined> {
  if (!bookmark) { return bookmark }
  switch (bookmark.platform as TPlatform) {

    case 'rumble': {

      // Get rumble video id
      if (bookmark.slug) {
        const url = new URL(`${RUMBLE_URL}${bookmark.slug}.html`)

        // Had to get rid of query string because it was causing errors.
        const compliantUrl = url.origin + url.pathname
  
        const response = await fetch(compliantUrl)
        const htmlText = await response.text()
        const matches = htmlText.match(/"video":"(.*?)"/) ?? []
        const [ m1, videoid ] = matches
        if (m1 && videoid) {
          return {
            ...bookmark,
            videoid
          }
        } else {
          C.err(`failed to parse video ID from rumble url`, matches)
        }
      }
    }

  }
  return bookmark
}