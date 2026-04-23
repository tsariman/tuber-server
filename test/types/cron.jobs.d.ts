declare module '../src/cron.jobs' {
  interface ITwitchRenewalResult {
    ok: boolean
    reason: string
    attempts: number
  }

  /**
   * Schedule the twitch token renewal.
   * @param expirationTimestamp milliseconds since epoch
   */
  export function schedule_twitch_token_renewal(expirationTimestamp: number): void
  export function clear_twitch_token_renewal_schedule(): void
  export function run_twitch_token_renewal(): Promise<boolean>
  export function run_twitch_token_renewal_with_runner(
    runner: () => Promise<ITwitchRenewalResult>
  ): Promise<boolean>
  const _default: () => void
  export default _default
}
