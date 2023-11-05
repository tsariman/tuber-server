import { VIMEO_URL } from 'src/constants'

export async function vimeo_fetch_thumbnail(videoid: string): Promise<string> {
  const response = await fetch(`${VIMEO_URL}api/oembed.json?url=https://vimeo.com/${videoid}`)
  const json = await response.json()
  const thumbnailUrl = json.thumbnail_url
  return thumbnailUrl
}