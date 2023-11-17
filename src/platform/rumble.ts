import axios from 'axios'
import { PLATFORM_URL } from '.'

export async function rumble_fetch_html_page(url?: string): Promise<string> {
  if (!url) { return '' }
  const response = await axios.get(url)
  const htmlText = response.data
  return htmlText
}

/**
 * Makes a request to the Rumble video page to obtain the thumbnail URL.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<string>`
 */
export async function rumble_fetch_thumbnail_url(slug?: string): Promise<string> {
  if (!slug) { return '' }
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`
  const response = await axios.get(compliantUrl)
  const htmlText = response.data
  const matches = htmlText.match(
    /<meta property=og:image content=(.+?)>/
  ) ?? []
  const [ m2, thumbnail_url ] = matches
  if (m2 && thumbnail_url) {
    return thumbnail_url
  }
  return ''
}

/**
 * Extract thumbnail URL from a Rumble video HTML page.
 *
 * @param html The HTML page of a Rumble video.
 * @returns `Promise<string>`
 */
export function rumble_parse_thumbnail_url(html: string): string {
  const matches = html.match(
    /<meta property=og:image content=(.+?)>/
  ) ?? []
  const [ m2, thumbnail_url ] = matches
  if (m2 && thumbnail_url) {
    return thumbnail_url
  }
  return ''
}

/**
 * Makes a request to the Rumble video page to obtain the video ID.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<string>`
 */
export async function rumble_fetch_videoid(slug: string): Promise<string> {
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`

  const response = await axios.get(compliantUrl)
  const htmlText = await response.data
  const matches = htmlText.match(
    /"video":"(.*?)"/
  ) ?? []
  const [ m2, videoid ] = matches
  if (m2 && videoid) {
    return videoid
  }
  return ''
}

/**
 * Extract videoid from a Rumble video HTML page.
 *
 * @param html The HTML page of a Rumble video.
 * @returns `Promise<string>`
 */
export function rumble_parse_videoid (html: string): string {
  const matches = html.match(
    /"video":"(.*?)"/
  ) ?? []
  const [ m2, videoid ] = matches
  if (m2 && videoid) {
    return videoid
  }
  return ''
}

/**
 * Makes a request to the Rumble video page to obtain the video ID and the
 * thumbnail URL.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<{ videoid: string, thumbnail_url: string }>`
 * @deprecated
 */
export async function rumble_fetch_videoid_thumbnail(
  slug: string
): Promise<{ videoid: string, thumbnail_url: string }> {
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`

  const response = await axios.get(compliantUrl)
  const htmlText = await response.data
  const regexp = new RegExp(
    /"video":"(.*?)"|<meta property=og:image content=(.+?)>/,
    'g'
  )
  const iterator = htmlText.matchAll(regexp)
  const matches = [ ...iterator ]
  const videoid = matches[1]?.[1]
  const thumbnail_url = matches[0]?.[2]
  if (videoid && thumbnail_url) {
    return { videoid, thumbnail_url }
  }
  return { videoid: '', thumbnail_url: '' }
}