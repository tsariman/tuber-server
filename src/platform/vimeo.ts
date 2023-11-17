import axios from 'axios'
import { PLATFORM_URL } from '.'

export async function vimeo_fetch_thumbnail(videoid?: string): Promise<string> {
  if (!videoid) { return '' }
  const response = await axios.get(`${PLATFORM_URL['vimeo']}api/oembed.json?url=https://vimeo.com/${videoid}`)
  const json = await response.data
  const thumbnailUrl = json.thumbnail_url
  return thumbnailUrl
}
