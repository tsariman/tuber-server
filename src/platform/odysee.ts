import { ODYSEE_URL } from '../constants'

export async function odysee_fetch_thumbnail(slug: string): Promise<string> {
  const response = await fetch(`https://odysee.com/$/oembed?url=${ODYSEE_URL}${slug}`)
  const json = await response.json()
  const thumbnailUrl = json.thumbnail_url
  return thumbnailUrl
}
