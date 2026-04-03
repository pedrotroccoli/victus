# Schema Conventions

Conventions for MongoDB document schemas in the Victus project.

## Field Naming

- **snake_case** for all field names (`recurrence_type`, `rule_engine_details`)
- **`_at` suffix** for timestamp fields (`finished_at`, `paused_at`, `created_at`)
- **`_id` suffix** for foreign keys (`account_id`, `parent_habit_id`)
- **Plural** for array fields (`connected_providers`, `children_habits`)

## Standard Fields

All documents include `Mongoid::Timestamps`, which provides:
- `created_at` (Time)
- `updated_at` (Time)

## Soft Deletes

Models using `Mongoid::Paranoia` get a `deleted_at` field. Use `.unscoped` to query deleted records.

**Models with soft delete:** Habit, HabitCheck, HabitCategory, HabitDelta, HabitCheckDelta, Subscription, Mood
**Models without soft delete:** Account, AuditLog

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

Add indexes via data migrations, not in model definitions. Document new indexes in the migration description.

## Data Migrations

- Use `mongoid_rails_migrations` for all schema/data changes
- Each migration must include a `validate!` class method that asserts postconditions
- Use `Mongoid::IrreversibleMigration` for non-reversible changes
- One concern per migration — keep migrations focused
- Run via `make migrate` from monorepo root

### Migration Template

```ruby
class DescriptiveName < Mongoid::Migration
  def self.up
    # data transformation logic
    validate!
  end

  def self.down
    raise Mongoid::IrreversibleMigration
    # or: reverse transformation logic
  end

  def self.validate!
    bad = Model.where(field: nil).count
    raise "Validation failed: #{bad} documents missing field" if bad > 0
  end
end
```
