import { PLATFORM_URL } from '.'

export async function odysee_fetch_thumbnail(slug: string): Promise<string> {
  const response = await fetch(`https://odysee.com/$/oembed?url=${PLATFORM_URL['odysee']}${slug}`)
  const json = await response.json()
  const thumbnailUrl = json.thumbnail_url
  return thumbnailUrl
}
