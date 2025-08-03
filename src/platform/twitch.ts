import * as dotenv from 'dotenv';
import Config from '../config';
import axios from 'axios';
import {
  CONF_TWITCH_CLIENT_ID,
  CONF_TWITCH_CLIENT_SECRET,
  CONF_TWITCH_ACCESS_TOKEN,
  CONF_TWITCH_TOKEN_EXPIRATION,
  CONF_TWITCH_REFRESH_TOKEN,
  CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL
} from 'src/constants.server';
import {
  get_twitch_renew_access_token_endpoint
} from './endpoint/get.twitch.renew.access.token.ep';
import { TObj } from '../common.types';
import { log } from '../utility/logging';

dotenv.config({ path: `${__dirname}/../../.env.twitch` });

/**
 * Twitch api url
 * [TODO] Save in the database.
 * @see https://dev.twitch.tv/docs/api/reference#get-videos
 * @returns `string`
 */
export const TWITCH_API_URL = process.env.TWITCH_API_URL
  ?? 'https://api.twitch.tv/helix/videos';

/**
 * Twitch client ID
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
 * @returns `string`
 */
export function twitch_get_api_client_id(): string {
  return Config.read<string|undefined>(CONF_TWITCH_CLIENT_ID)
    ?? process.env.TWITCH_API_CLIENT_ID
    ?? '';
}
/**
 * Twitch client secret
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
 * @returns `string`
 */
export function twitch_get_api_client_secret(): string {
  return Config.read<string|undefined>(CONF_TWITCH_CLIENT_SECRET)
    ?? process.env.TWITCH_API_CLIENT_SECRET
    ?? '';
}
/**
 * Twitch api access token
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
 * @returns `string`
 */
export function twitch_get_api_access_token(): string {
  return Config.read<string|undefined>(CONF_TWITCH_ACCESS_TOKEN)
    ?? process.env.TWITCH_API_ACCESS_TOKEN
    ?? '';
}
/**
 * Twitch api access token expiration date.
 * @see TWITCH_API_ACCESS_TOKEN
 * @returns `string`
 */
export function twitch_get_api_access_token_expires_in(): string {
  return Config.read<string|undefined>(CONF_TWITCH_TOKEN_EXPIRATION)
    ?? process.env.TWITCH_API_ACCESS_TOKEN_EXPIRES_IN
    ?? '';
}

/**
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-client-credentials-flow
 * @see https://dev.twitch.tv/docs/authentication/refresh-tokens/#:~:text=To%20refresh%20a%20user%20access,.tv%2Foauth2%2Ftoken%20.
 * @returns `string`
 */
export function twitch_get_oauth_url(): string {
  return process.env.TWITCH_OAUTH_URL
    ?? 'https://id.twitch.tv/oauth2/token';
}

export function twitch_get_api_refresh_token(): string {
  return Config.read<string|undefined>(CONF_TWITCH_REFRESH_TOKEN)
    ?? process.env.TWITCH_API_REFRESH_TOKEN
    ?? '';
}

/** Twitch api token request url */
export const TWITCH_API_TOKEN_REQUEST_URL = process.env.TWITCH_API_TOKEN_REQUEST_URL ?? '';

interface ITwitchResponseData {
  data?: Array<{ thumbnail_url?: string }>
}

/**
 * Fetch thumbnail URL from Twitch video ID.
 * @param videoid Twitch video ID.
 * @returns `Promise<string>`
 */
export async function twitch_fetch_thumbnail_url(videoid?: string): Promise<string> {
  if (!videoid
    || Config.read<boolean>(CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, false)
  ) { return '' }
  const url = `${TWITCH_API_URL}?id=${videoid}`;
  let response: TObj = {};
  let thumbnailUrlTemplate = '';
  let json = {} as ITwitchResponseData;
  let tries = 0;
  const maxTries = 2;
  do {
    if (tries >= maxTries) { return ''; }
    tries++;

    try {
      response = await axios.get(url, {
        headers: {
          // 'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-Id': twitch_get_api_client_id(),
          'Authorization': `Bearer ${twitch_get_api_access_token()}`
        }
      });
    } catch (e) {
      // [TODO] That's wrong. You should set a flag here that can be read in 
      //        another part of the code to renew the twitch access token.
      await get_twitch_renew_access_token_endpoint();
      continue;
    }

    json = response.data as ITwitchResponseData;
    if (json.data?.[0]?.thumbnail_url) {
      thumbnailUrlTemplate = json.data[0].thumbnail_url;
      break;
    } else {
      log(`[ERROR] twitch_fetch_thumbnail_url()`, json);
    }
  } while (!json.data?.[0]?.thumbnail_url);
  if (!thumbnailUrlTemplate) { return ''; }
  const thumbnailUrl = thumbnailUrlTemplate
    .replace('%{width}', '320')
    .replace('%{height}', '180');
  return thumbnailUrl;
}