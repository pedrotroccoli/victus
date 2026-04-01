# What to Avoid

> Gems and abstractions 37signals deliberately skips — with project-specific exceptions.

## Minimal Service Objects

37signals says: put behavior on the model, not in service objects.

**Project exception**: This project uses **Trailblazer Operations** (`app/operations/`) for multi-step business logic with validation contracts. This is an intentional architectural choice — Operations handle orchestration (validate → build → assign → save) while models stay focused on domain behavior.

```ruby
# Trailblazer Operation — orchestration layer
class Habits::Create < Trailblazer::Operation
  step :validate
  step :build_habit
  step :assign_account
  step :save
end

# Model — domain behavior
class Habit
  def check!(date:)
    # business logic lives here
  end
end
```

**Rule of thumb**: Simple CRUD → model methods. Multi-step workflows with validation → Operations.

## No Pundit/CanCanCan

Simple predicate methods on models:

```ruby
class Account
  def owns?(habit)
    habit.account_id == self.id
  end
end
```

Authorization is domain logic. It belongs on the model.

## No Decorators/Presenters

For APIs, serialize in the controller or use a simple method on the model:

```ruby
class Habit
  def as_json(*)
    super(only: [:id, :title, :rrule, :status])
  end
end
```

## No GraphQL

REST endpoints. If you need flexible queries, add query parameters.

## No Devise

Custom JWT auth in a concern. See [authentication.md](authentication.md).

## No ActiveRecord (by design)

This project uses **MongoDB/Mongoid**. No migrations, no `schema.rb`, no SQL. Embrace the document model — embedded docs, schemaless flexibility, atomic operations.

## The Philosophy

> "The best code is no code at all. The second best is code that uses what's already there."

Every dependency is a liability. Every abstraction layer is a place where bugs hide.
Write the simplest thing that could possibly work.

**Exception**: When an abstraction has already proven its value in the project (like Trailblazer for complex operations, or Dry-Validation for contracts), keep using it consistently rather than mixing approaches.
