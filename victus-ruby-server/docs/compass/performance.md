# Performance

> N+1 prevention, caching, query optimization. Adapted for Mongoid.

## N+1 Prevention

```ruby
# Bad — extra query per item
habits.each { |h| h.account.name }

# Good — eager load
Habit.includes(:account).where(status: "active")
```

## Preloaded Scopes

```ruby
scope :preloaded, -> { includes(:account, :habit_checks) }
```

Define and use consistently to avoid ad-hoc `includes`.

## HTTP Caching (ETags)

```ruby
def show
  @habit = @current_account.habits.find(params[:id])
  fresh_when etag: [@habit, @current_account]
end
```

Server still runs the action but skips rendering if ETag matches. Works great for read-heavy APIs.

## Batch Operations Over Loops

```ruby
# Good — single query
Habit.where(account_id: account.id, archived: true).delete_all

# Bad — N+1 delete
account.habits.archived.each(&:destroy)
```

## Use `pluck` Over `map`

```ruby
# Good — returns raw values, no model instantiation
Habit.where(account: account).pluck(:title)

# Bad — instantiates full Mongoid documents
account.habits.map(&:title)
```

## Use `update_all` for Bulk Updates

When no callbacks needed:

```ruby
Habit.where(account_id: old_id).update_all(account_id: new_id)
```

## Memoize Hot Paths

```ruby
def active_habits
  @active_habits ||= habits.where(status: "active").to_a
end
```

## Pre-Computed Counts

Without ActiveRecord's `counter_cache`, use MongoDB's atomic `$inc`:

```ruby
# Atomic increment — no read-modify-write race
account.inc(habits_count: 1)
account.inc(habits_count: -1)
```

## MongoDB-Specific Optimizations

- **Projection**: Only fetch fields you need — `Habit.where(...).only(:title, :rrule)`
- **Covered queries**: If all queried/returned fields are in an index, MongoDB never touches the document
- **Embedded docs over joins**: No `JOIN` cost — embedded data loads with the parent

## Pagination

- 25-50 items per page
- Cursor-based pagination (use `_id` or `created_at`) over offset-based
- Never load unbounded collections

## Key Principles

1. Define `preloaded` scopes, use them everywhere
2. In-memory checks over extra queries
3. HTTP caching with ETags for read endpoints
4. Batch operations over loops
5. `pluck` over `map`, `update_all` over `each.update`
6. `only` for field projection in Mongoid
7. Atomic `$inc` for counters
8. Always paginate — cursor-based preferred
