# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Victus is a personal assistant and all-in-one organizer composed of three projects:

| Project | Description | Tech Stack | Port |
|---------|-------------|------------|------|
| `victus-web-app/` | Main web application (SPA) — personal assistant UI | React + Vite + TypeScript | 5275 |
| `victus-ruby-server/` | API backend | Rails 7.2 + MongoDB | 3000 |
| `victus-home/` | Marketing landing page | Next.js 14 | 3001 |

Each project has its own `CLAUDE.md` with detailed commands and architecture.

## Quick Start

```bash
cp .env.example .env                      # fill in secrets
cp victus-web-app/.env.example victus-web-app/.env
make up                                   # starts everything
```

`make up` handles certs, hosts check, and docker compose. See `README.md` for details.

### Other commands

```bash
make down    # stop all services
make logs    # tail logs
make seed    # run db:seed
```

## Project Relationships

- **victus-web-app** consumes the API from **victus-ruby-server** via `VITE_API_URL`
- **victus-home** is a standalone marketing site
- All three projects support i18n (pt-BR, en, es)

## Authentication

Auth mechanisms:
- **Clerk**: Used by victus-web-app
- **World App MiniKit**: Alternative auth in victus-web-app for Worldcoin integration
- **JWT + SIWE**: Backend auth in victus-ruby-server (Sign-In with Ethereum for Web3)

## Package Managers

- victus-web-app: pnpm
- victus-home: npm
- victus-ruby-server: bundler (Ruby gems)
