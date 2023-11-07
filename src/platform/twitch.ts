import C from '../config'

export async function twitch_fetch_thumbnail(videoid: string): Promise<string> {
  const url = `${C.TWITCH_API_URL}?id=${videoid}`
  // [TODO] replace fetch with axios
  const response1 = await fetch(url, {
    method: 'GET',
    headers: {
      // 'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-Id': C.TWITCH_API_CLIENT_ID,
      'Authorization': `Bearer ${C.TWITCH_API_ACCESS_TOKEN}`
    }
  })
  const json = await response1.json()
  if (!json.data?.[0]?.thumbnail_url) {
    return ''
  }
  const thumbnailUrl = json.data[0].thumbnail_url
    .replace('%{width}', '320')
    .replace('%{height}', '180')
  return thumbnailUrl
}