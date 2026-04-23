import Config from './config'
import { CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, CONF_TWITCH_DISABLE_TOKEN_RENEWAL } from '@tuber/shared'
import { log } from './utility/logging'

/** Reference to the scheduled Twitch token renewal timeout */
let twitchRenewalTimeout: NodeJS.Timeout | null = null
/** Reference to an in-flight Twitch token renewal to prevent overlap */
let twitchRenewalInFlight: Promise<boolean> | null = null

interface ITwitchRenewalResult {
  ok: boolean
  reason: string
  attempts: number
}

/**
 * Start all cron jobs on app startup.
 * This function should be called once during initialization.
 */
export default function start_cron_jobs() {
  // Check if Twitch token renewal is disabled
  const renewalDisabled = Config.read<boolean>(CONF_TWITCH_DISABLE_TOKEN_RENEWAL, false)
  if (renewalDisabled) {
    log('[CRON] Twitch token renewal is disabled. Skipping cron setup.')
    log('[CRON] To re-enable, manually renew the token via /dev/twitch/renew-access-token')
    return
  }

  // Initialize the Twitch token renewal cron based on stored expiration
  const expirationTimestamp = Config.read<number>(CONF_TWITCH_TOKEN_EXPIRATION_TIMESTAMP, 0)
  if (expirationTimestamp > 0) {
    schedule_twitch_token_renewal(expirationTimestamp)
  } else {
    log('[CRON] No Twitch token expiration timestamp found. Skipping cron setup.')
    log('[CRON] Manually renew the token to enable automatic renewal.')
  }
}

/**
 * Schedule the Twitch token renewal to run one day before expiration.
 * If a previous timeout exists, it will be cleared and replaced.
 * 
 * @param expirationTimestamp - Unix timestamp (milliseconds) when the token expires
 */
export function schedule_twitch_token_renewal(expirationTimestamp: number) {
  // Clear any existing scheduled timeout
  if (twitchRenewalTimeout) {
    clearTimeout(twitchRenewalTimeout)
    twitchRenewalTimeout = null
    log('[CRON] Cleared previous Twitch token renewal timeout.')
  }

  const now = Date.now()
  // Schedule renewal for 1 day (24 hours) before expiration
  const oneDayMs = 24 * 60 * 60 * 1000
  const renewalTimestamp = expirationTimestamp - oneDayMs

  // If the renewal time has already passed, renew immediately
  if (renewalTimestamp <= now) {
    log('[CRON] Twitch token renewal time has passed. Renewing immediately...')
    void run_twitch_token_renewal()
    return
  }

  // Calculate the delay
  const delay = renewalTimestamp - now
  const renewalDate = new Date(renewalTimestamp)

  // Node.js setTimeout has a maximum value of 2^31-1 (approximately 24.8 days)
  // For delays longer than this, we need to use a different approach
  const MAX_TIMEOUT = 0x7FFFFFFF // 2147483647ms ≈ 24.8 days
  
  if (delay > MAX_TIMEOUT) {
    // For long delays, schedule an intermediate check
    log(`[CRON] Delay exceeds maximum setTimeout value (${Math.round(delay / 1000 / 60 / 60 / 24)} days)`)
    log(`[CRON] Will reschedule closer to renewal time`)
    
    // Schedule a check for 20 days from now, which will then schedule the actual renewal
    const intermediateDelay = 20 * 24 * 60 * 60 * 1000
    twitchRenewalTimeout = setTimeout(() => {
      // Reschedule with the original expiration timestamp
      schedule_twitch_token_renewal(expirationTimestamp)
    }, intermediateDelay)
    
    log(`[CRON] Scheduled intermediate check in ${Math.round(intermediateDelay / 1000 / 60 / 60 / 24)} days`)
    return
  }

  log(`[CRON] Scheduling Twitch token renewal for: ${renewalDate.toISOString()}`)
  log(`[CRON] Delay: ${delay}ms (${Math.round(delay / 1000 / 60 / 60)} hours)`)

  // Use setTimeout for one-time execution
  twitchRenewalTimeout = setTimeout(async () => {
    await run_twitch_token_renewal()
  }, delay)

  log('[CRON] Twitch token renewal scheduled successfully.')
}

/**
 * Execute the Twitch token renewal.
 * Uses dynamic import to avoid circular dependency issues.
 * 
 * Returns `true` on successful renewal and `false` otherwise.
 * The endpoint performs bounded retries before disabling renewal.
 */
export async function run_twitch_token_renewal() {
  return run_twitch_token_renewal_with_runner(async () => {
    // Dynamic import to avoid circular dependency
    const module = await import('./platform/endpoint/get.twitch.renew.access.token.ep.js')
    return module.renew_twitch_access_token() as Promise<ITwitchRenewalResult>
  })
}

/**
 * Execute Twitch token renewal with a runner function.
 * Exported for focused unit testing without network calls.
 */
export async function run_twitch_token_renewal_with_runner(
  runner: () => Promise<ITwitchRenewalResult>
): Promise<boolean> {
  if (twitchRenewalInFlight) {
    log('[CRON] Twitch token renewal already in progress. Reusing in-flight operation.')
    return twitchRenewalInFlight
  }

  twitchRenewalInFlight = (async () => {
    log('[CRON] Running Twitch token renewal...')
    try {
      const result = await runner()
      if (result.ok) {
        log(`[CRON] Twitch token renewal completed (attempts=${result.attempts}).`)
        return true
      }

      log(`[CRON] Twitch token renewal failed (${result.reason}, attempts=${result.attempts}).`)
      return false
    } catch (error) {
      log(`[CRON] Twitch token renewal failed: ${error}`)
      return false
    } finally {
      twitchRenewalInFlight = null
    }
  })()

  return twitchRenewalInFlight
}

/**
 * Clear the scheduled Twitch token renewal timeout.
 * Useful for testing and graceful shutdown.
 */
export function clear_twitch_token_renewal_schedule() {
  if (twitchRenewalTimeout) {
    clearTimeout(twitchRenewalTimeout)
    twitchRenewalTimeout = null
    log('[CRON] Cleared Twitch token renewal timeout.')
  }
}
