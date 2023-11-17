import * as dotenv from 'dotenv'
import Config from '../config'
import axios from 'axios'

dotenv.config({ path: `${__dirname}/../../.env.twitch` })

/** Twitch api url */
export const TWITCH_API_URL = process.env.TWITCH_API_URL
/** Twitch client ID */
export const TWITCH_API_CLIENT_ID = Config.read<string|undefined>('client_id')
  ?? process.env.TWITCH_API_CLIENT_ID
  ?? ''
/** Twitch client secret */
export const TWITCH_API_CLIENT_SECRET = Config.read<string|undefined>('client_secret')
  ?? process.env.TWITCH_API_CLIENT_SECRET
  ?? ''
/**
 * Twitch api access token
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
 */
export const TWITCH_API_ACCESS_TOKEN = Config.read<string|undefined>('access_token')
  ?? process.env.TWITCH_API_ACCESS_TOKEN
  ?? 'token-not-set'
/**
 * Twitch api access token expiration date.
 * @see TWITCH_API_ACCESS_TOKEN
 */
export const TWITCH_API_ACCESS_TOKEN_EXPIRES_IN = process.env.TWITCH_API_ACCESS_TOKEN_EXPIRES_IN
/** Twitch api token request url */
export const TWITCH_API_TOKEN_REQUEST_URL = process.env.TWITCH_API_TOKEN_REQUEST_URL ?? ''

/**
 * Fetch thumbnail URL from Twitch video ID.
 * @param videoid Twitch video ID.
 * @returns `Promise<string>`
 */
export async function twitch_fetch_thumbnail(videoid?: string): Promise<string> {
  if (!videoid) { return '' }
  const url = `${TWITCH_API_URL}?id=${videoid}`
  // [TODO] replace fetch with axios
  const response = await axios.get(url, {
    headers: {
      // 'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-Id': TWITCH_API_CLIENT_ID,
      'Authorization': `Bearer ${TWITCH_API_ACCESS_TOKEN}`
    }
  })
  const json = response.data
  if (!json.data?.[0]?.thumbnail_url) {
    return ''
  }
  const thumbnailUrl = json.data[0].thumbnail_url
    .replace('%{width}', '320')
    .replace('%{height}', '180')
  return thumbnailUrl
}