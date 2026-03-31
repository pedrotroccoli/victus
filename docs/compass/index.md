# 37signals Rails Compass (API Edition)

> Transferable Rails patterns from 37signals, adapted for API-only Rails + MongoDB/Mongoid.
> Source: [unofficial-37signals-coding-style-guide](https://github.com/pedrotroccoli/unofficial-37signals-coding-style-guide)

## Quick Start — The 37signals Way

1. **Rich domain models** over service objects (with Trailblazer for orchestration)
2. **CRUD controllers** over custom actions
3. **Concerns** for horizontal code sharing
4. **Records as state** over boolean fields
5. **Build it yourself** before reaching for gems
6. **Ship to learn** — prototype quality is valid
7. **Vanilla Rails is plenty** — maximize what Rails gives you

## Guides

### Philosophy & Principles
- [philosophy.md](philosophy.md) — Ship/Validate/Refine, naming, narrow APIs, review culture
- [what-they-avoid.md](what-they-avoid.md) — No Pundit, no Devise, minimal service objects (Trailblazer exception)

### Core Rails
- [models.md](models.md) — Concerns, state records, POROs, scopes (Mongoid)
- [controllers.md](controllers.md) — Thin controllers, concern catalog, API response patterns
- [routing.md](routing.md) — Everything is CRUD, noun-based resources, shallow nesting

### Backend
- [authentication.md](authentication.md) — JWT + SIWE, own your auth, declarative DSL
- [multi-tenancy.md](multi-tenancy.md) — Account-scoped everything, 404 over 403, subscription gating
- [database.md](database.md) — Mongoid patterns, indexing, embedded docs, atomic operations
- [background-jobs.md](background-jobs.md) — Sidekiq, error handling, shallow jobs, idempotency
- [filtering.md](filtering.md) — Filter POROs, composable scopes, URL state
- [performance.md](performance.md) — N+1, ETags, field projection, cursor pagination

### Infrastructure
- [security.md](security.md) — SSRF, rate limiting, authorization, CORS, HMAC signatures
- [webhooks.md](webhooks.md) — SSRF protection, delinquency tracking, HMAC, state machine
- [testing.md](testing.md) — Behavior testing, VCR, integration tests
- [observability.md](observability.md) — Structured logging, metrics, console auditing

## Adapted for This Project

This compass adapts 37signals patterns for:
- **MongoDB/Mongoid** instead of PostgreSQL/ActiveRecord
- **JWT + SIWE** instead of cookie-based sessions
- **Sidekiq** instead of Solid Queue
- **Trailblazer Operations** for multi-step orchestration
- **Dry-Validation Contracts** for input validation

## Removed (not relevant for API-only)

Stimulus, CSS, Hotwire, Views, Accessibility, Mobile, ActionCable,
Action Text, Active Storage, design/UX patterns (Jason Zimdars).
