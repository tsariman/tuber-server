# load-test-bookmarks.mjs

Quick guide for running bookmark endpoint load tests with the script in this folder.

## What it does

This script sends concurrent GET requests to a bookmarks collection endpoint for a fixed duration and prints JSON metrics including:

- total throughput (`throughput_rps_total`)
- successful throughput (`throughput_rps_ok`)
- success rate (`success_rate_pct`)
- latency percentiles (`p50`, `p95`, `p99`, `max`)

## Run command

From the `tuber-server` project root:

```powershell
pnpm run bench:bookmarks
```

The script is wired in `package.json` as:

```json
"bench:bookmarks": "node scripts/load-test-bookmarks.mjs"
```

## Environment variables

You can tune the run with env vars.

- `TARGET_URL`:
  Full URL to test.
  Default: `http://127.0.0.1:3000/bookmarks?filter[search]=test&page[number]=1&page[size]=20`
- `DURATION_SEC`:
  Test duration in seconds.
  Default: `20`
- `CONCURRENCY`:
  Number of parallel workers.
  Default: `50`
- `REQUEST_TIMEOUT_MS`:
  Per-request timeout in milliseconds.
  Default: `10000`
- `LABEL`:
  Free-form label for the run output.
  Default: `run`
- `BEARER_TOKEN`:
  Optional auth token. If provided, request header includes:
  `Authorization: Bearer <token>`

## Examples (PowerShell)

Test local server on port 8080:

```powershell
$env:TARGET_URL='http://127.0.0.1:8080/bookmarks?filter[search]=test&page[number]=1&page[size]=20'
$env:DURATION_SEC=30
$env:CONCURRENCY=100
$env:LABEL='local-8080'
pnpm run bench:bookmarks
```

Include auth token:

```powershell
$env:TARGET_URL='http://127.0.0.1:8080/bookmarks?filter[search]=test&page[number]=1&page[size]=20'
$env:BEARER_TOKEN='YOUR_JWT_TOKEN'
$env:LABEL='auth-run'
pnpm run bench:bookmarks
```

## Output shape

The script prints JSON similar to:

```json
{
  "label": "after-facet",
  "target": "http://127.0.0.1:8080/bookmarks?filter[search]=test&page[number]=1&page[size]=20",
  "durationSec": 20,
  "concurrency": 50,
  "timeoutMs": 10000,
  "requests": 2524,
  "ok": 2524,
  "failed": 0,
  "throughput_rps_total": 125.6,
  "throughput_rps_ok": 125.6,
  "success_rate_pct": 100,
  "latency_ms": {
    "p50": 58.22,
    "p95": 956.31,
    "p99": 974.37,
    "max": 987.47
  }
}
```

## How to compare runs

For reliable before/after comparisons:

1. Keep `TARGET_URL`, `DURATION_SEC`, and `CONCURRENCY` identical between runs.
2. Run each scenario multiple times (for example 3 to 5).
3. Compare median `throughput_rps_ok` and median `latency_ms.p95`.
4. Make sure `success_rate_pct` stays high (ideally close to 100).

## Notes

- High `throughput_rps_total` with low `throughput_rps_ok` usually means many failures.
- If your server is down, requests can fail fast and produce misleadingly high total throughput.
- Prefer `throughput_rps_ok` for meaningful performance comparisons.
