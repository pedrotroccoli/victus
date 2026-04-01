# Database Patterns

> State as records, schemaless documents, indexing strategy. Adapted for MongoDB/Mongoid.

## State as Records — Not Booleans

See [models.md](models.md) for full pattern. Key idea: an embedded or associated document with `user` and `created_at` beats a `closed: true` boolean.

## No Soft Deletes

Hard delete records. Use events/audit logs for history (see `Auditable` concern).

## Schemaless Doesn't Mean Structureless

MongoDB has no migrations, but models should still define their fields explicitly in Mongoid:

```ruby
class Habit
  include Mongoid::Document

  field :title, type: String
  field :rrule, type: String
  field :rule_engine_enabled, type: Boolean, default: false

  embeds_many :habit_deltas
  belongs_to :account
end
```

Explicit fields = self-documenting schema.

## Index What You Query

```ruby
class Habit
  include Mongoid::Document

  index({ account_id: 1 })
  index({ account_id: 1, created_at: -1 })

  # Unique constraints via index
  index({ code: 1 }, { unique: true })
end
```

Create indexes: `rake db:mongoid:create_indexes`

## Unique Constraints via Indexes

```ruby
# Application-level validation (race conditions possible)
validates :code, uniqueness: true

# Preferred — database constraint
index({ code: 1 }, { unique: true })
```

Use both when you need user-facing error messages. Use index-only for internal data.

## Account Scoping (Multi-Tenancy)

```ruby
validates :number, uniqueness: { scope: :account_id }
```

## Always Scope Lookups

```ruby
# Bad
@habit = Habit.find(params[:id])

# Good
@habit = @current_account.habits.find(params[:id])
```

## Embedded Documents for Tight Coupling

MongoDB's strength — use embedded documents for data that always lives with its parent:

```ruby
class Habit
  embeds_many :habit_deltas
end

class HabitDelta
  embedded_in :habit
end
```

Use `has_many`/`belongs_to` for data queried independently.

## Batch Operations Over Loops

```ruby
# Good
Habit.where(account_id: account.id, archived: true).delete_all

# Bad — N+1 delete
account.habits.archived.each(&:destroy)
```

## Pre-Computed Counts

Without ActiveRecord's `counter_cache`, maintain counts manually:

```ruby
after_create :increment_parent_count
after_destroy :decrement_parent_count

# Or use MongoDB's $inc atomically
account.inc(habits_count: 1)
```

## Key Principles

1. State records over booleans
2. Hard deletes + audit logs
3. Explicit field definitions (self-documenting schema)
4. Index what you query — `rake db:mongoid:create_indexes`
5. Unique indexes for DB-level constraints
6. Embedded documents for tightly coupled data
7. Always scope through tenant/account
