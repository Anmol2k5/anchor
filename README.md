# Anchor

A Progressive Web App (PWA) for people experiencing Depersonalization-Derealization Disorder (DPDR) and severe panic attacks. A digital lifeline — minimalist, distraction-free, and instantly responsive.

## Features

- **One-Tap SOS Grounding** — immediate access to grounding exercises
- **Offline-First PWA** — works in airplane mode via Service Workers & IndexedDB
- **5-4-3-2-1 Grounding Flow** — interactive sensory grounding with animated breathing anchor
- **Audio Anchors** — pre-recorded voice notes for crisis moments
- **AI Grounding Companion** — real-time chat with a bounded, safe AI assistant
- **Daily Mood Logging** — track sleep, stress, and notes

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Mobile:** Expo (React Native)
- **Backend:** Express, TypeScript
- **Database:** Drizzle ORM + PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **AI:** Supabase Edge Functions + OpenAI

## Project Structure

```
├── artifacts/
│   ├── api-server/       # Express TypeScript API
│   ├── mobile/           # Expo React Native app
│   └── mockup-sandbox/   # Vite React PWA
├── lib/
│   ├── api-client-react/ # Generated API client
│   ├── api-spec/         # OpenAPI specification
│   ├── api-zod/          # Zod validation schemas
│   └── db/               # Drizzle ORM schema
└── scripts/              # Build scripts
```

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the web app: `cd artifacts/mockup-sandbox && pnpm dev`
4. Run the API server: `cd artifacts/api-server && pnpm dev`
5. Run the mobile app: `cd artifacts/mobile && pnpm dev`

## Deployment

The web app is deployed via GitHub Pages. See `.github/workflows/ci.yml` for the CI/CD pipeline.

## License

MIT
