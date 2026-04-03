# Schema Conventions

Conventions for MongoDB document schemas in the Victus project.

## Field Naming

- **snake_case** for all field names (`recurrence_type`, `rule_engine_details`)
- **`_at` suffix** for timestamp fields (`finished_at`, `paused_at`, `created_at`)
- **`_id` suffix** for foreign keys (`account_id`, `parent_habit_id`)
- **Plural** for collections and arrays (`connected_providers`)

## Standard Fields

All documents include `Mongoid::Timestamps`, which provides:
- `created_at` (Time)
- `updated_at` (Time)

## Deletes

Hard deletes only. History/audit trail is recorded only for models that explicitly include the `Auditable` concern (see `AuditLog` model for audited create/update/destroy events).

## Embedded vs Referenced

| Pattern | Use When | Example |
|---------|----------|---------|
| **Embedded** (`embeds_many`/`embeds_one`) | Tightly coupled, always loaded together, no independent lifecycle | `HabitDelta` embedded in `Habit` |
| **Referenced** (`has_many`/`belongs_to`) | Independent lifecycle, queried separately, many-to-many | `HabitCheck` references `Habit` |

## Hash Fields

Use `type: Hash` for flexible sub-documents that don't warrant a separate model:
- `recurrence_details` — RRULE configuration (`{ rule: "FREQ=DAILY;INTERVAL=1" }`)
- `rule_engine_details` — AND/OR logic for compound habits
- `service_details` — Stripe/subscription metadata

## Indexes

Define indexes in model files. Run `rake db:mongoid:create_indexes` to apply.

## Schema Evolution

MongoDB is schemaless — no migrations needed. Schema evolves in model field definitions:

- **Add field**: add `field` declaration with a `default` value; old documents return the default
- **Remove field**: remove the `field` declaration; old data in documents is ignored
- **Data fixes**: use one-off rake tasks in `lib/tasks/` for cleaning existing data
