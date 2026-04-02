# Victus

Personal assistant and all-in-one organizer.

## Projects

| Project | Description | Tech Stack | Port |
|---------|-------------|------------|------|
| `victus-web-app/` | Web application (SPA) | React + Vite + TypeScript | 5275 |
| `victus-ruby-server/` | API backend | Rails 7.2 + MongoDB | 3000 |
| `victus-home/` | Marketing landing page | Next.js 14 | 3001 |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- [mkcert](https://github.com/FiloSottile/mkcert) (`brew install mkcert`)

## Quick Start

```bash
# 1. Copy and fill environment variables
cp .env.example .env
cp victus-web-app/.env.example victus-web-app/.env

# 2. Start the full dev stack (MongoDB + Rails + Vite + Caddy)
make up
```

That's it. `make up` automatically:
- Generates local HTTPS certificates (via mkcert) if they don't exist
- Checks that `dev.victusjournal.com` is in `/etc/hosts`
- Starts all services via Docker Compose

Once running, open **https://dev.victusjournal.com**.

### /etc/hosts

If `make up` warns about the hosts file, run:

```bash
echo '127.0.0.1 dev.victusjournal.com' | sudo tee -a /etc/hosts
```

## Available Commands

| Command | Description |
|---------|-------------|
| `make up` | Start the full dev stack |
| `make down` | Stop all services |
| `make logs` | Tail logs from all services |
| `make seed` | Run database seeds |

## Running Services Individually

```bash
# Just MongoDB
docker compose --profile dev up mongodb

# Rails outside Docker (requires local Ruby 3.3)
# Note: create victus-ruby-server/.env with MONGO_URI pointing to 127.0.0.1
# instead of "mongodb" (the Docker service name doesn't resolve on the host)
cd victus-ruby-server && rails s

# Vite outside Docker
cd victus-web-app && pnpm dev

# Landing page
cd victus-home && npm run dev
```

## Environment Variables

### Root `.env` (shared / infra)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `SECRET_KEY_BASE` | Yes | Rails secret key |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `STRIPE_SECRET_KEY` | No | Stripe API key |

### `victus-web-app/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API URL (e.g. `http://localhost:3000`) |
