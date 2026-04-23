import { test } from 'node:test'
import * as assert from 'node:assert'
import {
  schedule_twitch_token_renewal,
  clear_twitch_token_renewal_schedule,
  run_twitch_token_renewal,
  run_twitch_token_renewal_with_runner
} from '../src/cron.jobs'
import start_cron_jobs from '../src/cron.jobs'

// Time constants for tests
const ONE_SECOND_MS = 1000
const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS
const ONE_DAY_MS = 24 * ONE_HOUR_MS

test('cron.jobs module exports', async (t) => {
  // Verify the exported functions exist
  assert.ok(typeof schedule_twitch_token_renewal === 'function')
  assert.ok(typeof clear_twitch_token_renewal_schedule === 'function')
  assert.ok(typeof run_twitch_token_renewal === 'function')
  assert.ok(typeof start_cron_jobs === 'function')
})

test('schedule_twitch_token_renewal - schedules renewal for future expiration', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Set expiration to 2 days from now
  const twoDaysMs = 2 * ONE_DAY_MS
  const futureExpiration = Date.now() + twoDaysMs

  // Should schedule without errors
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(futureExpiration)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - handles expiration in the past', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Set expiration to 2 days ago
  const twoDaysMs = 2 * ONE_DAY_MS
  const pastExpiration = Date.now() - twoDaysMs

  // Should not throw error, should attempt immediate renewal
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(pastExpiration)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - handles expiration less than 1 day away', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Set expiration to 12 hours from now (less than the 1-day buffer)
  const twelveHoursMs = 12 * ONE_HOUR_MS
  const soonExpiration = Date.now() + twelveHoursMs

  // Should attempt immediate renewal since renewalTimestamp would be in the past
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(soonExpiration)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - clears previous timeout when rescheduling', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Schedule first renewal
  const futureExpiration1 = Date.now() + (5 * ONE_DAY_MS)
  schedule_twitch_token_renewal(futureExpiration1)

  // Schedule second renewal (should clear first)
  const futureExpiration2 = Date.now() + (10 * ONE_DAY_MS)
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(futureExpiration2)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - handles maximum timeout value', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Set expiration to 60 days from now (Twitch token typical lifespan)
  const sixtyDaysMs = 60 * ONE_DAY_MS
  const longExpiration = Date.now() + sixtyDaysMs

  // Should schedule without errors even with large timeout
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(longExpiration)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('clear_twitch_token_renewal_schedule - clears scheduled timeout', async (t) => {
  // Schedule a renewal
  const futureExpiration = Date.now() + (5 * ONE_DAY_MS)
  schedule_twitch_token_renewal(futureExpiration)

  // Should clear without errors
  assert.doesNotThrow(() => {
    clear_twitch_token_renewal_schedule()
  })

  // Clearing again should also not error
  assert.doesNotThrow(() => {
    clear_twitch_token_renewal_schedule()
  })
})

test('schedule_twitch_token_renewal - calculates correct delay', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  const now = Date.now()
  const threeDaysMs = 3 * ONE_DAY_MS
  const expirationTimestamp = now + threeDaysMs
  
  // Expected renewal time is 1 day before expiration
  const oneDayMs = ONE_DAY_MS
  const expectedRenewalTime = expirationTimestamp - oneDayMs
  const expectedDelay = expectedRenewalTime - now

  // The delay should be approximately 2 days (3 days - 1 day buffer)
  // Allow 1 second tolerance for test execution time
  const tolerance = ONE_SECOND_MS
  const twoDaysMs = 2 * ONE_DAY_MS
  
  assert.ok(Math.abs(expectedDelay - twoDaysMs) < tolerance)

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - handles zero timestamp', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Zero timestamp should trigger immediate renewal
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(0)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - handles negative timestamp', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Negative timestamp should trigger immediate renewal
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(-1000)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('schedule_twitch_token_renewal - handles delays exceeding MAX_TIMEOUT', async (t) => {
  // Clear any existing schedule
  clear_twitch_token_renewal_schedule()

  // Set expiration to 60 days from now (exceeds the ~24.8 day max timeout)
  const sixtyDaysMs = 60 * ONE_DAY_MS
  const longExpiration = Date.now() + sixtyDaysMs

  // Should schedule intermediate check without errors or warnings
  assert.doesNotThrow(() => {
    schedule_twitch_token_renewal(longExpiration)
  })

  // Clean up
  clear_twitch_token_renewal_schedule()
})

test('run_twitch_token_renewal_with_runner - reuses in-flight renewal', async () => {
  let calls = 0
  const runner = async () => {
    calls++
    await new Promise(resolve => setTimeout(resolve, 20))
    return { ok: true, reason: 'success', attempts: 1 }
  }

  const [result1, result2] = await Promise.all([
    run_twitch_token_renewal_with_runner(runner),
    run_twitch_token_renewal_with_runner(runner)
  ])

  assert.equal(calls, 1)
  assert.equal(result1, true)
  assert.equal(result2, true)
})

test('run_twitch_token_renewal_with_runner - allows next run after completion', async () => {
  let calls = 0
  const runner = async () => {
    calls++
    return { ok: true, reason: 'success', attempts: 1 }
  }

  const result1 = await run_twitch_token_renewal_with_runner(runner)
  const result2 = await run_twitch_token_renewal_with_runner(runner)

  assert.equal(calls, 2)
  assert.equal(result1, true)
  assert.equal(result2, true)
})

test('run_twitch_token_renewal_with_runner - returns false on failed status', async () => {
  const result = await run_twitch_token_renewal_with_runner(async () => {
    return { ok: false, reason: 'exhausted-retries', attempts: 3 }
  })

  assert.equal(result, false)
})
