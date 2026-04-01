# Philosophy & Principles

> Core principles from 37signals' 265 PRs. Adapted for API-only Rails.

## Ship, Validate, Refine

- Merge "prototype quality" code to validate with real usage before cleanup
- Don't polish prematurely — real-world usage reveals what matters
- Features evolve through iterations

## Fix Root Causes, Not Symptoms

**Bad**: Add retry logic for race conditions
**Good**: Use `enqueue_after_transaction_commit` to prevent the race

## Vanilla Rails Over Abstractions

- Thin controllers calling rich domain models
- No service objects unless truly justified
- Direct model calls: `@card.comments.create!(params)`
- When services exist, they're POROs: `Signup.new(email:).create_identity`

## When to Extract

- Start in controller, extract when it gets messy
- Don't extract prematurely — wait for pain
- Rule of three: duplicate twice before abstracting

## Write-Time vs Read-Time

All manipulation should happen when you save, not when you present:
- Pre-compute roll-ups at write time
- Use counter caches instead of manual counting
- Use `dependent: :delete_all` when no callbacks needed

## Abstractions Must Earn Their Keep

- Question every layer of indirection
- If you can't point to 3+ variations that need it, inline it
- Methods and classes that don't explain anything should be removed

## Naming Principles

- **Positive names**: `active` not `not_deleted`
- **Domain language**: `depleted?` not `over_limit?`
- **Method names reflect return value**: `collect` implies array
- Consistent domain language throughout

## Be Explicit Over Clever

- 2-3 cases: explicit `case` statements beat metaprogramming
- Don't add base class extensions for one-off methods
- Define methods directly vs introspection

## Narrow Public APIs

- Only expose what's actually used
- "The narrower the public surface of a class the better"

## Objects Emerge from Coupling

When parameters get passed through multiple method layers, extract an object:

```ruby
# Smell: shared param coupling
def cost(within:); end
def limit_cost(within:); end

# Solution: extract a model
class Ai::Quota < ApplicationRecord
  def spend(cost); end
  def ensure_not_depleted; end
end
```

## StringInquirer for Action Predicates

```ruby
def action
  self[:action].inquiry
end
# Usage: event.action.completed?
```

## Review Culture

- **Teach through questions**: "What do you think of..." not "Change this to..."
- **Name technical debt specifically**: unnamed debt is invisible debt
- **Label quality level explicitly**: "prototype quality" sets expectations
- **Ship to validate**: production data answers faster than local profiling
