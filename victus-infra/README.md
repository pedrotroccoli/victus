# Victus Infra

Deploy setup para `victus-ruby-server` em VPS.

## Requirements

- Docker + Docker Compose
- Imagem `victus-ruby-server:latest` buildada localmente
- MongoDB externo (Atlas ou similar)

## Deploy

```bash
# 1. Buildar a imagem
docker build -t victus-ruby-server:latest ./victus-ruby-server

# 2. Configurar .env na raiz do monorepo (ver .env.example)

# 3. Subir em produção (na raiz do monorepo)
docker compose --profile prod up -d

# Ver logs
docker compose --profile prod logs -f
```

## Desenvolvimento local

```bash
# Subir MongoDB + Rails + Caddy (na raiz do monorepo)
docker compose --profile dev up

# Ou só o MongoDB
docker compose --profile dev up mongodb

# Só MongoDB + Rails (sem Caddy)
docker compose --profile dev up mongodb web
```

## Configuration

Edite `.env` na raiz do monorepo antes de subir:

**Obrigatórios:**
- `MONGO_URI` - Connection string MongoDB externo
- `JWT_SECRET` - Secret para JWT
- `SECRET_KEY_BASE` - Rails secret (gerar com `rails secret`)

**Opcionais:**
- `RAILS_MASTER_KEY` - Se usar credentials
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
