#!/usr/bin/env node

import { performance } from 'node:perf_hooks'

function parseNumber(name, fallback) {
  const raw = process.env[name]
  if (!raw) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0
  const idx = Math.ceil((p / 100) * sortedValues.length) - 1
  return sortedValues[Math.max(0, Math.min(idx, sortedValues.length - 1))]
}

async function run() {
  const target = process.env.TARGET_URL || 'http://127.0.0.1:3000/bookmarks?filter[search]=test&page[number]=1&page[size]=20'
  const durationSec = parseNumber('DURATION_SEC', 20)
  const concurrency = Math.max(1, parseNumber('CONCURRENCY', 50))
  const timeoutMs = Math.max(1000, parseNumber('REQUEST_TIMEOUT_MS', 10000))
  const label = process.env.LABEL || 'run'
  const token = process.env.BEARER_TOKEN

  const endAt = Date.now() + (durationSec * 1000)

  let requests = 0
  let ok = 0
  let failed = 0
  const latencies = []

  async function worker() {
    while (Date.now() < endAt) {
      const started = performance.now()
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const res = await fetch(target, {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        })

        requests += 1
        if (res.ok) {
          ok += 1
        } else {
          failed += 1
        }
      } catch {
        requests += 1
        failed += 1
      } finally {
        clearTimeout(timeout)
        latencies.push(performance.now() - started)
      }
    }
  }

  const startedAt = performance.now()
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  const elapsedMs = performance.now() - startedAt

  latencies.sort((a, b) => a - b)

  const elapsedSec = elapsedMs / 1000
  const totalRps = elapsedSec > 0 ? requests / elapsedSec : 0
  const okRps = elapsedSec > 0 ? ok / elapsedSec : 0
  const successRate = requests > 0 ? (ok / requests) * 100 : 0

  console.log(JSON.stringify({
    label,
    target,
    durationSec,
    concurrency,
    timeoutMs,
    requests,
    ok,
    failed,
    throughput_rps_total: Number(totalRps.toFixed(2)),
    throughput_rps_ok: Number(okRps.toFixed(2)),
    success_rate_pct: Number(successRate.toFixed(2)),
    latency_ms: {
      p50: Number(percentile(latencies, 50).toFixed(2)),
      p95: Number(percentile(latencies, 95).toFixed(2)),
      p99: Number(percentile(latencies, 99).toFixed(2)),
      max: Number((latencies.at(-1) ?? 0).toFixed(2)),
    },
  }, null, 2))
}

run().catch((e) => {
  console.error('[bench:bookmarks] failed:', e)
  process.exit(1)
})
