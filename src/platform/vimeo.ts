import { PLATFORM_URL } from '.'

export async function vimeo_fetch_thumbnail(videoid: string): Promise<string> {
  const response = await fetch(`${PLATFORM_URL['vimeo']}api/oembed.json?url=https://vimeo.com/${videoid}`)
  const json = await response.json()
  const thumbnailUrl = json.thumbnail_url
  return thumbnailUrl
}