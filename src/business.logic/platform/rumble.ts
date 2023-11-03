import { RUMBLE_URL } from '../../constants'

export async function rumble_fetch_thumbnail(slug: string): Promise<string> {
  const urlObj = new URL(`${RUMBLE_URL}${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`
  const response = await fetch(compliantUrl)
  const htmlText = await response.text()
  const matches = htmlText.match(
    /<meta property=og:image content=(.+?)>/
  ) ?? []
  const [ m2, thumbnail_url ] = matches
  if (m2 && thumbnail_url) {
    return thumbnail_url
  }
  return ''
}