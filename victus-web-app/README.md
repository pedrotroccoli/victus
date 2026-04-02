# Victus Web App

Victus is a personal assistant and all-in-one organizer. This is the main web application (SPA).

## Quick Start

```bash
# From the monorepo root (recommended)
make up

# Or standalone (set VITE_API_URL=http://localhost:3000 if not using Caddy)
pnpm dev
```

## Tech Stack

- React 18 + TypeScript + Vite
- TanStack Router + TanStack Query
- Tailwind CSS + shadcn/ui
- i18next (en, pt-BR, es)

## For developers

See `CLAUDE.md` for architecture details and coding patterns.
