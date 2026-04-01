# Victus Infra

Deploy setup para `victus-ruby-server` em VPS.

## Requirements

- Docker + Docker Compose
- Imagem `victus-ruby-server:latest` buildada localmente
- MongoDB externo (Atlas ou similar)

## Deploy

```bash
# 1. Buildar a imagem (no diretório victus-ruby-server)
cd ../victus-ruby-server
docker build -t victus-ruby-server:latest .

# 2. Subir o container (neste diretório)
cd ../victus-infra
docker compose up -d

# Ver logs
docker compose logs -f
```

## Configuration

Edite `.env` antes de subir:

**Obrigatórios:**
- `MONGO_URI` - Connection string MongoDB externo
- `JWT_SECRET` - Secret para JWT
- `SECRET_KEY_BASE` - Rails secret (gerar com `rails secret`)

**Opcionais:**
- `RAILS_MASTER_KEY` - Se usar credentials
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
# victus-infra
