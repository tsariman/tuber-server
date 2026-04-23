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

const TWITCH_TOKEN_RENEWAL_RETRY_DELAYS_MS = [0, 1500, 5000]

export interface ITwitchTokenRenewalResult {
  ok: boolean
  reason: string
  attempts: number
}

export interface ITwitchTokenRenewalDeps {
  isRenewalDisabled: () => boolean
  getClientId: () => string
  getClientSecret: () => string
  requestToken: (clientId: string, clientSecret: string) => Promise<{ status: number, data: any }>
  saveConfig: (key: string, value: any) => Promise<any>
  disableAndClearKeys: () => Promise<void>
  scheduleRenewal: (expirationTimestamp: number) => Promise<void>
  sleepMs: (ms: number) => Promise<void>
  now: () => number
  toErrorMessage: (error: unknown) => string
}

const sleep = async (ms: number) => {
  if (ms <= 0) {
    return
  }
  await new Promise<void>(resolve => setTimeout(resolve, ms))
}

async function disable_renewal_and_clear_keys() {
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
}

/**
 * Endpoint is meant to be called by the server to renew the access token.  
 * [TODO] Cause this function to put website in maintenance mode for a few
 *        seconds.
 * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-flow
 * @see https://dev.twitch.tv/docs/authentication#types-of-tokens
 * @returns `void`
 */
export async function get_twitch_renew_access_token_endpoint() {
  await renew_twitch_access_token()
}

/**
 * Renew Twitch token and return operational status for cron and diagnostics.
 */
export async function renew_twitch_access_token(): Promise<ITwitchTokenRenewalResult> {
  return renew_twitch_access_token_with_deps()
}

/**
 * Renew Twitch token with injectable dependencies for endpoint-level unit tests.
 */
export async function renew_twitch_access_token_with_deps(
  deps: Partial<ITwitchTokenRenewalDeps> = {},
  retryDelaysMs: number[] = TWITCH_TOKEN_RENEWAL_RETRY_DELAYS_MS,
): Promise<ITwitchTokenRenewalResult> {
  const resolvedDeps: ITwitchTokenRenewalDeps = {
    isRenewalDisabled: () => Config.read<boolean>(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, false),
    getClientId: twitch_get_api_client_id,
    getClientSecret: twitch_get_api_client_secret,
    requestToken: async (clientId: string, clientSecret: string) => {
      const response = await axios.post(REQUEST_URL, new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      return { status: response.status, data: response.data }
    },
    saveConfig: async (key: string, value: any) => Config.save(key, value),
    disableAndClearKeys: disable_renewal_and_clear_keys,
    scheduleRenewal: async (expirationTimestamp: number) => {
      const { schedule_twitch_token_renewal } = await import('../../cron.jobs.js')
      schedule_twitch_token_renewal(expirationTimestamp)
    },
    sleepMs: sleep,
    now: () => Date.now(),
    toErrorMessage: (error: unknown) => {
      const normalized = to_net_error_object(error)
      return String(normalized?.response?.data ?? normalized?.message ?? normalized)
    },
    ...deps,
  }

  if (resolvedDeps.isRenewalDisabled()) {
    return {
      ok: false,
      reason: 'renewal-disabled',
      attempts: 0,
    }
  }

  const client_id = resolvedDeps.getClientId()
  const client_secret = resolvedDeps.getClientSecret()

  if (!client_id || !client_secret) {
    console.log('[Error] missing Twitch client credentials; cannot renew access token')
    await resolvedDeps.disableAndClearKeys()
    return {
      ok: false,
      reason: 'missing-client-credentials',
      attempts: 0,
    }
  }

  // Twitch access token expires every 60 days. This is the logic to renew it.
  let lastErrorMessage = 'unknown-error'
  let attempts = 0

  for (const delayMs of retryDelaysMs) {
    attempts++
    if (delayMs > 0) {
      await resolvedDeps.sleepMs(delayMs)
    }

    try {
      const response = await resolvedDeps.requestToken(client_id, client_secret)

      if (response.status !== 200) {
        lastErrorMessage = `unexpected-status-${response.status}`
        console.log('[Error] failed to renew Twitch access token', response.data)
        if (attempts < retryDelaysMs.length) {
          console.log(`[Error] retrying Twitch token renewal attempt ${attempts + 1}/${retryDelaysMs.length}`)
        }
        continue
      }

      const json = response.data
      const expirationTimestamp = resolvedDeps.now() + (json.expires_in * 1000)
      await resolvedDeps.saveConfig(CONF_TWITCH_ACCESS_TOKEN, json.access_token)
      await resolvedDeps.saveConfig(CONF_TWITCH_TOKEN_EXPIRATION, json.expires_in)
      await resolvedDeps.saveConfig(CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, expirationTimestamp)
      await resolvedDeps.saveConfig(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, false)
      await resolvedDeps.saveConfig(CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, false)

      // Schedule the next token renewal cron job
      await resolvedDeps.scheduleRenewal(expirationTimestamp)

      return {
        ok: true,
        reason: 'success',
        attempts,
      }
    } catch (e) {
      lastErrorMessage = resolvedDeps.toErrorMessage(e)
      console.log('[Error] failed to renew Twitch access token', lastErrorMessage)
      if (attempts < retryDelaysMs.length) {
        console.log(`[Error] retrying Twitch token renewal attempt ${attempts + 1}/${retryDelaysMs.length}`)
      }
    }
  }

  await resolvedDeps.disableAndClearKeys()
  return {
    ok: false,
    reason: `exhausted-retries:${lastErrorMessage}`,
    attempts,
  }
}

/*
 Example json response:
{
  "access_token": "jostpf5q0uzmxmkba9iyug38kjtgh",
  "expires_in": 5011271,
  "token_type": "bearer"
}
*/
