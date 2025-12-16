# Installation and Setup Guide

## Rate Limiting Setup (Fastify)

This project includes a lightweight, built-in throttling for development (per-IP counters in route handlers). For production, prefer `@fastify/rate-limit` for robust, tested rate limiting with configurable policies.

### Install

```bash
pnpm add @fastify/rate-limit
# or: npm i @fastify/rate-limit
```

### Basic Usage

Register the plugin in your server bootstrap (e.g., `src/app.ts`) before routes:

```ts
import rateLimit from '@fastify/rate-limit'

await fastify.register(rateLimit, {
	// Global defaults (tune per environment)
	max: 100,            // requests per timeWindow
	timeWindow: '1 minute',
	ban: 0,              // set >0 to ban IPs after consecutive violations
	cache: 10000,        // LRU cache size
	allowList: [],       // ips or tokens to bypass limits
	skipOnError: true,   // do not block on internal errors
	continueExceeding: false, // reset counters per window
})
```

You can override per-route:

```ts
fastify.route({
	method: 'POST',
	url: '/signin',
	config: {
		rateLimit: {
			max: 20,
			timeWindow: '1 minute',
		}
	},
	handler: signinHandler,
})

fastify.route({
	method: 'POST',
	url: '/users',
	config: {
		rateLimit: {
			max: 10,
			timeWindow: '1 minute',
		}
	},
	handler: signupHandler,
})
```

### Environment-aware Configuration

Use existing `Config` values to tune limits:

```ts
await fastify.register(rateLimit, {
	max: Config.DEV ? 1000 : 100,
	timeWindow: Config.DEV ? '1 minute' : '1 minute',
	skipOnError: true,
})
```

### Notes

- Development already uses a simple per-IP throttle directly in routes; it is sufficient for local work.
- Prefer `@fastify/rate-limit` in production for consistent behavior across instances.
- Pair rate limiting with authentication and abuse checks (e.g., domain filters for email, CAPTCHA after thresholds, IP/ASN heuristics).
- If behind a proxy or load balancer, ensure Fastify sees the real client IP (configure `trustProxy`).

### References

- `@fastify/rate-limit` docs: https://github.com/fastify/fastify-rate-limit
- Fastify `trustProxy`: https://www.fastify.io/docs/latest/Reference/Server/#trustproxy

---

# Users Collation & Index Migration

Ensure the `users` collection uses case-insensitive collation and unique indexes for `name` and `email`.

## Run Migration

```bash
pnpm migrate:users-collation
# or
npm run migrate:users-collation
```

This script will:
- Create the collection with collation `{ locale: 'en', strength: 2 }` if missing.
- Drop existing `name`/`email` indexes.
- Create unique, case-insensitive indexes on `name` and `email`.

Run it once per environment (dev/prod) after configuring DB settings in `.env.*`.
