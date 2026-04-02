# Victus Infra

Deploy setup for `victus-ruby-server` on VPS.

## Requirements

- Docker + Docker Compose
- `victus-ruby-server:latest` image built locally
- External MongoDB (Atlas or similar)

## Deploy

```bash
# 1. Build the image
docker build -t victus-ruby-server:latest ./victus-ruby-server

# 2. Configure .env at the monorepo root (see .env.example)

# 3. Start production (from the monorepo root)
docker compose --profile prod up -d

# View logs
docker compose --profile prod logs -f
```

## Local Development

```bash
# Start MongoDB + Rails + Caddy (from the monorepo root)
docker compose --profile dev up

# Or just MongoDB
docker compose --profile dev up mongodb

# MongoDB + Rails only (no Caddy)
docker compose --profile dev up mongodb web
```

## Configuration

Edit `.env` at the monorepo root before starting:

**Required:**
- `MONGO_URI` - External MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `SECRET_KEY_BASE` - Rails secret (generate with `rails secret`)

**Optional:**
- `RAILS_MASTER_KEY` - If using credentials
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
