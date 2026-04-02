# Reverse Proxy Setup

Victus uses two different reverse proxies depending on the environment.

## Why a reverse proxy?

- **Single origin** — the frontend and API share the same domain, avoiding CORS and mixed-content issues (HTTPS page → HTTP API).
- **TLS termination** — HTTPS is handled once at the proxy; backend services stay on plain HTTP internally.
- **Path-based routing** — `/api/*` goes to Rails, everything else goes to Vite.

## Dev: Caddy

[Caddy](https://caddyserver.com/docs/) handles local HTTPS via mkcert certificates.

### How it works

```
Browser → https://dev.victusjournal.com
  ├─ /api/*  → http://web:3000    (Rails)
  └─ /*      → http://frontend:5275 (Vite)
```

The `Caddyfile` at the monorepo root defines these rules:

```caddyfile
dev.victusjournal.com {
  tls /etc/caddy/certs/dev.victusjournal.com.pem /etc/caddy/certs/dev.victusjournal.com-key.pem
  reverse_proxy /api/* http://web:3000
  reverse_proxy http://frontend:5275
}
```

### Why Caddy for dev?

- Zero config for reverse proxy — just a few lines.
- Supports custom TLS certificates out of the box.
- Lightweight and fast to start.

### Prerequisites

1. **mkcert** — generates locally-trusted certificates so browsers don't show warnings.
   - Install: [github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert#installation)
   - `make up` auto-generates certs if they don't exist.

2. **/etc/hosts** — map the dev domain to localhost:
   ```
   127.0.0.1 dev.victusjournal.com
   ```

### Caddy docs

- [Caddyfile concepts](https://caddyserver.com/docs/caddyfile/concepts)
- [reverse_proxy directive](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
- [tls directive](https://caddyserver.com/docs/caddyfile/directives/tls)

---

## Prod: Traefik

[Traefik](https://doc.traefik.io/traefik/) handles production HTTPS with automatic Let's Encrypt certificates.

### How it works

```
Internet → https://server.victusjournal.com
  └─ victus-api container (Rails, port 3000)
```

Traefik discovers services via Docker labels on the `victus-server` container:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.victus-api.rule=Host(`${VICTUS_SERVER_DOMAIN}`)"
  - "traefik.http.routers.victus-api.tls.certresolver=letsencrypt"
```

### Why Traefik for prod?

- **Automatic HTTPS** — obtains and renews Let's Encrypt certificates without manual intervention.
- **Docker-native** — reads container labels to configure routing, no separate config file needed.
- **HTTP → HTTPS redirect** — built-in middleware.

### Required environment variables

| Variable | Description |
|----------|-------------|
| `LETSENCRYPT_EMAIL` | Email for Let's Encrypt ACME registration |
| `VICTUS_SERVER_DOMAIN` | Production domain (e.g. `server.victusjournal.com`) |

### Traefik docs

- [Getting started](https://doc.traefik.io/traefik/getting-started/quick-start/)
- [Docker provider](https://doc.traefik.io/traefik/providers/docker/)
- [Let's Encrypt](https://doc.traefik.io/traefik/https/acme/)
- [HTTP to HTTPS redirect](https://doc.traefik.io/traefik/middlewares/http/redirectscheme/)
