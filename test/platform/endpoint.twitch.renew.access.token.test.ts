import { test } from 'node:test'
import * as assert from 'node:assert'
import {
  CONF_TWITCH_ACCESS_TOKEN,
  CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL,
  CONF_TWITCH_DISABLE_TOKEN_RENEWAL,
  CONF_TWITCH_TOKEN_EXPIRATION,
  CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP,
} from '@tuber/shared'
import {
  renew_twitch_access_token_with_deps,
} from '../../src/platform/endpoint/get.twitch.renew.access.token.ep'

test('renew_twitch_access_token_with_deps - exhausts retries and returns failure', async () => {
  let requestCalls = 0
  const sleepCalls: number[] = []
  let disableCalls = 0

  const result = await renew_twitch_access_token_with_deps({
    isRenewalDisabled: () => false,
    getClientId: () => 'client-id',
    getClientSecret: () => 'client-secret',
    requestToken: async () => {
      requestCalls++
      throw new Error('network-down')
    },
    disableAndClearKeys: async () => {
      disableCalls++
    },
    sleepMs: async (ms: number) => {
      sleepCalls.push(ms)
    },
    toErrorMessage: () => 'network-down',
  }, [0, 1, 2])

  assert.equal(result.ok, false)
  assert.equal(result.attempts, 3)
  assert.equal(result.reason, 'exhausted-retries:network-down')
  assert.equal(requestCalls, 3)
  assert.deepEqual(sleepCalls, [1, 2])
  assert.equal(disableCalls, 1)
})

test('renew_twitch_access_token_with_deps - disable flow clears required Twitch keys', async () => {
  const saved: Array<[string, any]> = []

  const saveConfig = async (key: string, value: any) => {
    saved.push([key, value])
  }

  const disableAndClearKeys = async () => {
    await saveConfig(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, true)
    await saveConfig(CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, true)
    await saveConfig(CONF_TWITCH_ACCESS_TOKEN, '')
    await saveConfig(CONF_TWITCH_TOKEN_EXPIRATION, '')
    await saveConfig(CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, 0)
  }

  const result = await renew_twitch_access_token_with_deps({
    isRenewalDisabled: () => false,
    getClientId: () => 'client-id',
    getClientSecret: () => 'client-secret',
    requestToken: async () => {
      throw new Error('still-down')
    },
    saveConfig,
    disableAndClearKeys,
    sleepMs: async () => {},
    toErrorMessage: () => 'still-down',
  }, [0])

  assert.equal(result.ok, false)
  assert.equal(result.reason, 'exhausted-retries:still-down')
  assert.deepEqual(saved, [
    [CONF_TWITCH_DISABLE_TOKEN_RENEWAL, true],
    [CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL, true],
    [CONF_TWITCH_ACCESS_TOKEN, ''],
    [CONF_TWITCH_TOKEN_EXPIRATION, ''],
    [CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, 0],
  ])
})

test('renew_twitch_access_token_with_deps - success schedules computed expiration once', async () => {
  const fixedNow = 1_700_000_000_000
  const expiresInSeconds = 3600
  const expectedExpirationTimestamp = fixedNow + (expiresInSeconds * 1000)

  const scheduled: number[] = []
  const saved: Array<[string, any]> = []

  const result = await renew_twitch_access_token_with_deps({
    isRenewalDisabled: () => false,
    getClientId: () => 'client-id',
    getClientSecret: () => 'client-secret',
    requestToken: async () => ({
      status: 200,
      data: {
        access_token: 'token-abc',
        expires_in: expiresInSeconds,
      },
    }),
    saveConfig: async (key: string, value: any) => {
      saved.push([key, value])
    },
    scheduleRenewal: async (expirationTimestamp: number) => {
      scheduled.push(expirationTimestamp)
    },
    sleepMs: async () => {},
    now: () => fixedNow,
  }, [0])

  assert.equal(result.ok, true)
  assert.equal(result.reason, 'success')
  assert.equal(result.attempts, 1)
  assert.deepEqual(scheduled, [expectedExpirationTimestamp])
  assert.ok(saved.some(([key, value]) => key === CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP && value === expectedExpirationTimestamp))
})
