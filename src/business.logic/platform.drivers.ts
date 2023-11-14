import fetch from 'cross-fetch'
import { IBookmark } from '../schema/bookmarks'
import { TPlatform } from '../common.types'
import C from '../config'
import { PLATFORM_URL } from '../platform'

export default async function fix_missing_bookmark_data (
  attributes?: IBookmark
): Promise<IBookmark|undefined> {
  if (!attributes) { return attributes }
  switch (attributes.platform as TPlatform) {

    case 'rumble': {

      // Get rumble video id
      if (attributes.slug) {
        const url = new URL(`${PLATFORM_URL['rumble']}${attributes.slug}.html`)

        // Had to get rid of query string because it was causing errors.
        const compliantUrl = url.origin + url.pathname
  
        const response = await fetch(compliantUrl)
        const htmlText = await response.text()
        const matches = htmlText.match(/"video":"(.*?)"/) ?? []
        const [ m1, videoid ] = matches
        if (m1 && videoid) {
          return {
            ...attributes,
            videoid
          }
        } else {
          C.err(`failed to parse video ID from rumble url`, matches)
        }
      }
    }

  }
  return attributes
}