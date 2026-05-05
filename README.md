# tuber-server

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![build-passing](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
[![@tuber/shared](https://img.shields.io/badge/github-@tuber/shared-blue?logo=github)](https://github.com/tsariman/tuber-shared)

**The backend for BookmarkTube** — A fast, production-ready REST API that powers precise timestamp bookmarking for videos across YouTube, Rumble, Twitch, Vimeo, Odysee, Dailymotion, and more.

**Live Demo**: [https://BookmarkTube.com](https://BookmarkTube.com)

![BookmarkTube Screenshot](https://uc150119f5eefdd038b17b40f6ba.previews.dropboxusercontent.com/p/thumb/AC-5euYWEBejFTKWvljmnziRmP5bp070src29pFGnXPDKuGOpY6vhQgaT3oxrsU6MPX8563H-3hOenYN214qsRUwGsPrfGl9Z0Jkka3yCNa-3MucHOwyFxeRfTPLg04z1y04J-luedFXW7UQLwnB17Oqms9VWuhimS9gA9s9PiRgcbY6LGJzXYT08eWbZ4QXnr9dCb6Xh5HZNQbDOvLMvkui1zrTPfdrpNA-OzFDvXOgHGsC0XCane1UXSiNs1wGT2ygQf8aKqt4xuoV3Lx-Wd_7TDJsIFWe2pvMa29o7Mt_Bn7QmVGJFi7jNIlG3Krv8lk02KRVFthsuCE0jedhKLT8AKrkJTDYtE8ZT8yJFfiwi8er-oUb5-VKfpU7x76Du64/p.png?is_prewarmed=true)  

## Features

- **JSON:API compliant RESTful API** — Consistent, predictable responses with strong typing.
- **Fastify + TypeScript** — High-performance backend with autoloaded routes and plugins.
- **MongoDB + Mongoose** — Flexible schema design for bookmarks, users, and video metadata.
- **Authentication & Security** — JWT + HttpOnly cookies, rate limiting, bcrypt, input validation.
- **Production ready** — Winston logging, cron jobs, error handling, CORS, Docker support, AWS CloudFormation deployment.
- **Shared types** — Single source of truth with [`@tuber/shared`](../tuber-shared).

## Tech Stack

- **Framework**: Fastify (with TypeScript)
- **Database**: MongoDB + Mongoose
- **API Spec**: JSON:API (with custom query parser)
- **Auth**: JWT + secure cookies
- **Logging**: Winston
- **Validation**: Built-in + JSON:API structure
- **Deployment**: AWS EC2 + CloudFormation, Docker
- **Testing**: Vitest / Jest compatible
- **Shared types**: [`@tuber/shared`](../tuber-shared)

## Architecture Highlights

- **Autoload pattern** — Routes, plugins, and hooks are automatically discovered.
- **Clean separation** — `business.logic/`, `platform/` (video providers), `schema/`, `middleware/`, and `controllers/`.
- **JSON:API focus** — Consistent resource formatting, relationships, and error handling.
- **Video platform layer** — Abstracted handlers for reliable timestamp extraction and embed support across providers.
- **Bootstrap & cron jobs** — Initial data seeding and background tasks.

This backend is designed for **maintainability, performance, and rapid feature development** while serving a dynamic JSON-driven frontend.

## Local Development

This repo is part of a **pnpm workspace** (together with `tuber-client` and `tuber-shared`).

```bash
# From workspace root
pnpm install

# Start the server (MongoDB must be running locally or via Docker)
pnpm --filter tuber-server dev
```

### Required Environment Variables
See `.env.example` (copy to `.env`).

### Scripts

```bash
pnpm dev          # Development with hot reload
pnpm build        # Compile TypeScript
pnpm start        # Run built version
pnpm lint         # ESLint
pnpm test         # Run tests
```

## Project Structure

```
src/
├── business.logic/     # Core business rules and services
├── platform/           # Video platform integrations (YouTube, Rumble, etc.)
├── schema/             # Mongoose models
├── routes/             # API routes (autoloaded)
├── middleware/         # Auth, rate limiting, error handling
├── controllers/        # Request handlers
├── plugins/            # Fastify plugins
├── utils/              # Shared utilities
├── config/             # Environment & app config
└── app.ts              # Main Fastify application setup
```

## Related Repositories

- **[tuber-client](https://github.com/tsariman/tuber-client)** — React 19 + TypeScript frontend
- **[tuber-shared](https://github.com/tsariman/tuber-shared)** — Shared TypeScript types and constants
- **Infrastructure**: AWS CloudFormation templates (in separate repo or private)

## Deployment

- Dockerized for easy containerization
- AWS EC2 + CloudFormation scripts included
- Zero-downtime deployment support

## Roadmap

- Vector search for semantic bookmark lookup (MongoDB Atlas)
- Grok API integration for AI clip summaries
- Enhanced analytics and public bookmark API
- Rate limiting & abuse prevention improvements

## Feedback & Contributions

Testers, bug reports, and feature ideas are highly appreciated!  
Reach out on X: [@riviereking](https://x.com/riviereking)

---

**Made with ❤️ by Riviere King**
