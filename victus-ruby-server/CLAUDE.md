# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Victus is a Rails 7.2 API backend for a habit tracking application. It uses MongoDB (via Mongoid) as the database and includes features for habit management, subscriptions (Stripe), and user authentication (JWT + SIWE for Web3).

## Common Commands

### Development

```bash
# Start MongoDB (required)
docker-compose up -d

# Start the Rails server
rails s

# Rails console
rails c
```

### Testing

```bash
# Run all tests
bundle exec rspec

# Run a single test file
bundle exec rspec spec/models/habit_check_spec.rb

# Run a specific test by line number
bundle exec rspec spec/models/habit_check_spec.rb:42
```

### Database

MongoDB is the only database. No migrations - Mongoid uses schemaless documents.

```bash
# Purge test database (done automatically before each spec)
Mongoid.purge!
```

## Architecture

### API Structure

Routes are organized under `/api/v1/` with three controller namespaces:
- `Private::` - Authenticated endpoints requiring JWT + active subscription (habits, habits_check, me, mood, etc.)
- `Public::` - Unauthenticated endpoints (auth/sign-in, auth/sign-up, SIWE auth)
- `Internal::` - Webhook endpoints (Stripe)

### Authentication

Private controllers include `ActiveAndAuthorized` concern which enforces:
1. `authorize_request` - Validates JWT from Authorization header, sets `@current_account`
2. `check_subscription` - Requires active subscription (returns 402 if not active)

### Core Domain Models (Mongoid)

- **Account** - User with email/password auth or Web3 (world_address). Has subscription, habits, moods
- **Habit** - Recurring habit with RRULE-based scheduling. Can have parent/children (hierarchical habits) and rule engine for compound logic
- **HabitCheck** - Records completion of a habit. Validates against RRULE schedule and rule engine conditions
- **HabitDelta** - Embedded in Habit for tracking incremental changes
- **Subscription** - Stripe subscription status

### Business Logic Patterns

**Trailblazer Operations** (`app/operations/`): Multi-step business logic with validation. Example: `Habits::Create` validates params via contract, builds habit, assigns account, saves.

**Dry-Validation Contracts** (`app/contracts/`): Input validation schemas. Example: `Habits::CreateHabitContract` validates habit creation params including RRULE format.

**Rule Engine**: Habits can have `rule_engine_enabled: true` with `rule_engine_details` containing AND/OR logic referencing other habit IDs. HabitCheck validates these conditions.

**RruleInternal** (`app/services/rrule_internal.rb`): Wrapper for RRULE parsing/validation. Format: `FREQ=DAILY;INTERVAL=1;UNTIL=20250327T000000Z;BYDAY=MO,TU`

**Auditable Concern**: Models including this get automatic AuditLog entries for create/update/destroy.

### Background Jobs

Sidekiq for async processing. EmailJob sends emails via MailerSend.

## Environment Variables

Required:
- `MONGO_URI` - MongoDB connection string
- `MONGO_TEST_URI` - Test database connection (defaults to localhost)
- `JWT_SECRET` - Secret for JWT encoding/decoding

## Testing Patterns

- Uses RSpec with FactoryBot
- Factories in `spec/factories/`
- Database cleaned via `Mongoid.purge!` before each test
- Test database configured in `config/mongoid.yml` under `test:`

## Coding Guidelines (37signals-inspired)

> Guia completo disponível em: [docs/37signals-style-guide.md](docs/37signals-style-guide.md)

### Princípios Core

| Princípio | Descrição |
|-----------|-----------|
| Ship/Validate/Refine | Código funcionando em produção primeiro. Valide com uso real antes de polir. |
| Root-Cause Engineering | Conserte a causa raiz, não os sintomas. |
| Vanilla Rails | Maximize o framework antes de adicionar gems. |
| Thin Controllers, Rich Models | Controllers orquestram. Business logic em models. |
| State as Records | Prefira records dedicados sobre booleans. |
| Rule of Three | Duplique 2x antes de abstrair. |

### Model Patterns

- Concerns para comportamento horizontal (50-150 linhas, coesos)
- Validações mínimas; validações contextuais (`:on`) quando necessário
- Bang methods (`create!`, `save!`) para falhas explícitas
- Callbacks apenas para setup/cleanup, não business logic
- Scopes com nomes de negócio (`active`, `completed`)

### Controller Patterns

- Authorization via `before_action`; lógica de permissão no model
- `ApplicationController` mínimo
- Múltiplos formatos via `respond_to`

### Routing Patterns

- Everything is CRUD - converta ações em resources
- `resource` (singular) para one-per-parent
- `resources` (plural) para múltiplos
- Shallow nesting para URLs limpas

### O Que Evitar

- Service objects desnecessários (prefira rich domain models)
- Gems quando Rails resolve (Devise → custom auth, Pundit → predicates no model)
- Form objects, decorators (use strong params, helpers, partials)
- Abstrações prematuras
