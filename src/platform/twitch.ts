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
  const maxTries = 2
  let tries = 0
  do {
    if (json.data?.[0]?.thumbnail_url) {
      break
    }
    const response2 = await fetch(C.TWITCH_API_TOKEN_REQUEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: C.TWITCH_API_CLIENT_ID,
        client_secret: C.TWITCH_API_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }).toString()
    })
    const json2 = await response2.json()
    if (!json2.data) {
      // [TODO] Renew token
      const response3 = await fetch(url, {})

      return ''
    }
    json.data = json2.data
    tries++
  } while (tries < maxTries)
  if (!json.data?.[0]?.thumbnail_url) {
    return ''
  }
  const thumbnailUrl = json.data[0].thumbnail_url
    .replace('%{width}', '320')
    .replace('%{height}', '180')
  return thumbnailUrl
}