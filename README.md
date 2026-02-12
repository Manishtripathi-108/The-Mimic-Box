# The Mimic Box

## Overview

The Mimic Box is a Next.js (App Router) media and gaming hub that blends account-based experiences with streaming services and media utilities. It integrates with Spotify, JioSaavn, and AniList for discovery and syncing, ships with an audio player, supports uploads and processing, and includes a PWA setup with offline-ready assets.

## Key Features

- Auth and account linking with NextAuth
- Media discovery and sync across Spotify, JioSaavn, and AniList
- Audio player with media session support
- File uploads with progress tracking
- PWA service worker via Serwist
- Prisma + PostgreSQL data layer
- Responsive UI and reusable component system

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth (v5 beta)
- Serwist (PWA)
- FFmpeg (WASM) for client-side audio processing
- Socket.IO (real-time)

## Project Structure

- `src/app/` App Router routes, layouts, and metadata
- `src/components/` Reusable UI and view components
- `src/actions/` Server actions
- `src/hooks/` Custom React hooks
- `src/lib/` Utilities, services, schemas, and styles
- `src/contexts/` Context providers
- `src/reducers/` Reducers for complex state
- `prisma/` Database schema and migrations
- `public/` Static assets and PWA artifacts

## Requirements

- Node.js 18+
- npm 9+ (or yarn/pnpm if you prefer)
- PostgreSQL database

## Getting Started

1. Create environment file:
    ```bash
    copy .env.example .env
    ```
2. Fill in required environment variables (at minimum `DATABASE_URL`).
3. Install dependencies (runs Prisma generate and migrate deploy via `postinstall`):
    ```bash
    npm install
    ```
4. Start the dev server:
    ```bash
    npm run dev
    ```
5. Open `http://localhost:3000`.

## Environment Variables

Use [.env.example](.env.example) as a template.

| Variable                              | Description                        |
| ------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_APP_NAME`                | App display name                   |
| `NEXT_PUBLIC_URL`                     | Base URL for the app               |
| `DATABASE_URL`                        | PostgreSQL connection string       |
| `AUTH_SECRET`                         | NextAuth secret                    |
| `AUTH_GOOGLE_ID`                      | Google OAuth client id             |
| `AUTH_GOOGLE_SECRET`                  | Google OAuth client secret         |
| `AUTH_GITHUB_ID`                      | GitHub OAuth client id             |
| `AUTH_GITHUB_SECRET`                  | GitHub OAuth client secret         |
| `AUTH_ANILIST_ID`                     | AniList OAuth client id            |
| `AUTH_ANILIST_SECRET`                 | AniList OAuth client secret        |
| `AUTH_SPOTIFY_ID`                     | Spotify OAuth client id            |
| `AUTH_SPOTIFY_SECRET`                 | Spotify OAuth client secret        |
| `AUTH_SPOTIFY_SCOPES`                 | Spotify OAuth scopes               |
| `SMTP_USER`                           | SMTP username for email            |
| `SMTP_PASS`                           | SMTP password for email            |
| `CLOUDINARY_CLOUD_NAME`               | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`                  | Cloudinary API key                 |
| `CLOUDINARY_API_SECRET`               | Cloudinary API secret              |
| `NEXT_PUBLIC_EXTERNAL_AUDIO_BASE_URL` | External base URL for audio assets |

## Scripts

- `npm run dev` Start dev server
- `npm run build` Production build
- `npm run start` Run production server
- `npm run lint` Lint the codebase
- `npm run format` Format with Prettier
- `npm run db:generate` Generate Prisma client
- `npm run db:mig:dev` Create a new migration
- `npm run db:mig:deploy` Apply migrations
- `npm run db:mig:reset` Reset database (dev only)
- `npm run db:push` Push schema to database
- `npm run db:pull` Pull schema from database
- `npm run db:seed` Seed database
- `npm run db:studio` Open Prisma Studio

## PWA Notes

The service worker is built with Serwist and pre-caches key assets, including FFmpeg WASM files located in `public/download/`. The source worker lives at `src/app/sw.ts`, with output emitted to `public/sw.js` at build time.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request against `main`

## License

MIT - see [LICENSE](LICENSE).
