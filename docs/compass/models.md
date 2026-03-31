# Models

> Rich domain models with composable concerns and state as records. Adapted for Mongoid.

## Heavy Use of Concerns

```ruby
class Habit
  include Mongoid::Document
  include Mongoid::Timestamps
  include Auditable, RuleEngineEnabled
end
```

## Concern Structure: Self-Contained

```ruby
module Auditable
  extend ActiveSupport::Concern

  included do
    after_create  :log_create
    after_update  :log_update
    after_destroy :log_destroy
  end

  private

  def log_create
    AuditLog.create!(auditable: self, action: :create, account: account)
  end
  # ...
end
```

## State as Records, Not Booleans

```ruby
# BAD
class Habit
  field :closed, type: Boolean
  scope :closed, -> { where(closed: true) }
end

# GOOD — who/when, plus audit trail
class Closure
  include Mongoid::Document
  belongs_to :habit
  belongs_to :user, optional: true
  field :created_at, type: Time
end

class Habit
  has_one :closure, dependent: :destroy
  scope :closed, -> { where(:closure.exists => true) }
  scope :open, -> { where(:closure.exists => false) }
end
```

## Default Values

```ruby
field :rule_engine_enabled, type: Boolean, default: false
field :status, type: String, default: "active"

belongs_to :creator, class_name: "Account", default: -> { Current.account }
```

## Current for Request Context

```ruby
class Current < ActiveSupport::CurrentAttributes
  attribute :account, :request_id, :user_agent, :ip_address
end
```

## Minimal Validations

Validate only what the database can't enforce. Contextual validations when needed:

```ruby
validates :title, presence: true
validates :rrule, presence: true, on: :create
```

For complex validation, use Dry-Validation contracts (project convention):

```ruby
class Habits::CreateHabitContract < Dry::Validation::Contract
  params do
    required(:title).filled(:string)
    required(:rrule).filled(:string)
  end
end
```

## Let It Crash (Bang Methods)

```ruby
@habit = @current_account.habits.create!(habit_params)
```

## Callbacks: Used Sparingly

For setup/cleanup only, NOT business logic.

## PORO Patterns

POROs are model-adjacent, NOT service objects (controller-adjacent):

```ruby
# Presentation/serialization logic
class Habit::Summary
  def initialize(habit)
    @habit = habit
  end

  def as_json
    { title: @habit.title, streak: calculate_streak }
  end
end
```

## Scope Naming

```ruby
# Good — business-focused
scope :active, -> { where(status: "active") }
scope :for_account, ->(account) { where(account_id: account.id) }
scope :recently_created, -> { order(created_at: :desc) }
scope :with_rule_engine, -> { where(rule_engine_enabled: true) }

# Bad — implementation-ish
scope :where_not_archived, -> { ... }
```

## Concern Organization

1. Each concern: **50-150 lines**
2. Must be **cohesive** — related functionality together
3. Don't create concerns just to reduce file size
4. Name for capability: `Auditable`, `RuleEngineEnabled`
5. Concerns = auxiliary **public** traits. Private methods = inline in main class.

## Embedded Documents for Value Objects

```ruby
class Habit
  embeds_many :habit_deltas
end

class HabitDelta
  embedded_in :habit
  field :value, type: Float
  field :recorded_at, type: Time
end
```

Embedded docs are atomically saved with their parent — no separate queries.
