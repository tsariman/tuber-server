import axios from 'axios'
import {
  TWITCH_API_TOKEN_REQUEST_URL as REQUEST_URL,
  twitch_get_api_client_id,
  twitch_get_api_client_secret,
} from '../twitch'
import {
  CONF_TWITCH_ACCESS_TOKEN,
  CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL,
  CONF_TWITCH_DISABLE_TOKEN_RENEWAL,
  CONF_TWITCH_TOKEN_EXPIRATION,
  CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP
} from '@tuber/shared'
import Config from '../../config'
import { to_net_error_object } from '../../utility'

/**
 * Endpoint is meant to be called by the server to renew the access token.  
 * [TODO] Cause this function to put website in maintenance mode for a few
 *        seconds.
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-flow
 * @see https://dev.twitch.tv/docs/authentication#types-of-tokens
 * @returns `void`
 */
export async function get_twitch_renew_access_token_endpoint() {
  if (Config.read<boolean>(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, false)) {
    return
  }
  const client_id = twitch_get_api_client_id()
  const client_secret = twitch_get_api_client_secret()
  // Twitch access token expires every 60 days. This is the logic to renew it.
  let response
  try {
    response = await axios.post(REQUEST_URL, new URLSearchParams({
      client_id,
      client_secret,
      grant_type: 'client_credentials'
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  } catch (e) {
    const error = to_net_error_object(e)
    console.log('[Error] failed to renew Twitch access token', error?.response?.data ?? error?.message ?? error)
    process.stdout.write('[Error] clearing all Twitch authorization keys... ')
    await Config.save(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, true)
    await Config.save(CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, true)
    await Config.save(CONF_TWITCH_ACCESS_TOKEN, '')
    await Config.save(CONF_TWITCH_TOKEN_EXPIRATION, '')
    await Config.save(CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, 0)
    console.log('Done.')
    console.log('Manually visit endpoint: /dev/twitch/renew-access-token')
    console.log('OR')
    console.log('Manually input new Twitch authorization keys in the ' + '`.env.twitch` file.')
    return
  }

  if (response.status !== 200) {
    console.log('[Error] failed to renew Twitch access token', response.data)
    process.stdout.write('[Error] clearing all Twitch authorization keys... ')
    await Config.save(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, true)
    await Config.save(CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, true)
    await Config.save(CONF_TWITCH_ACCESS_TOKEN, '')
    await Config.save(CONF_TWITCH_TOKEN_EXPIRATION, '')
    await Config.save(CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, 0)
    console.log('Done.')
    console.log('Manually visit endpoint: /dev/twitch/renew-access-token')
    console.log('OR')
    console.log('Manually input new Twitch authorization keys in the ' + '`.env.twitch` file.')
    return
  }

  const json = response.data
  const expirationTimestamp = Date.now() + (json.expires_in * 1000)
  await Config.save(CONF_TWITCH_ACCESS_TOKEN, json.access_token)
  await Config.save(CONF_TWITCH_TOKEN_EXPIRATION, json.expires_in)
  await Config.save(CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, expirationTimestamp)

  // Schedule the next token renewal cron job
  // Using dynamic import to avoid circular dependency
  const { schedule_twitch_token_renewal } = await import('../../cron.jobs.js')
  schedule_twitch_token_renewal(expirationTimestamp)
}

/*
 Example json response:
{
  "access_token": "jostpf5q0uzmxmkba9iyug38kjtgh",
  "expires_in": 5011271,
  "token_type": "bearer"
}
*/
