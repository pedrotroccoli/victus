# Multi-Tenancy

> Account-scoped everything. Secure by default.

## Core Principle

Every query goes through `@current_account`. No exceptions.

```ruby
# Private controllers set @current_account via JWT
module ActiveAndAuthorized
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
    before_action :check_subscription
  end

  private

  def authorize_request
    token = request.headers["Authorization"]&.split(" ")&.last
    decoded = JWT.decode(token, jwt_secret)
    @current_account = Account.find(decoded["account_id"])
  rescue JWT::DecodeError, Mongoid::Errors::DocumentNotFound
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
```

## Scope All Data Access

```ruby
# Bad — bypasses tenant isolation
@habit = Habit.find(params[:id])

# Good — scoped to current account
@habit = @current_account.habits.find(params[:id])
```

This prevents one account from accessing another's data, even with a valid ID.

## Account as Root Aggregate

```ruby
class Account
  include Mongoid::Document

  has_many :habits, dependent: :destroy
  has_many :habit_checks, dependent: :destroy
  has_many :moods, dependent: :destroy
  has_one :subscription
end
```

All business data hangs off Account. This makes data isolation natural.

## 404 Over 403

When a user tries to access another account's resource, return **404 Not Found** — not 403 Forbidden. Don't leak existence.

```ruby
# .find on a scoped query raises Mongoid::Errors::DocumentNotFound
# which should map to 404
@habit = @current_account.habits.find(params[:id])
```

## Subscription Gating

Separate auth (401) from payment (402):

```ruby
def check_subscription
  unless @current_account.subscription_active?
    render json: { error: "Subscription required" }, status: :payment_required
  end
end
```

## Background Jobs: Preserve Tenant Context

Jobs run outside the request cycle — pass the account explicitly:

```ruby
# Bad — Current.account won't exist in job context
EmailJob.perform_later(template: :welcome)

# Good — pass account explicitly
EmailJob.perform_later(@current_account.id, template: :welcome)
```

## Key Principles

1. **Every query scoped through `@current_account`** — no global lookups
2. **Account as root aggregate** — all data belongs to an account
3. **404 not 403** for cross-tenant access — don't leak existence
4. **Separate 401/402** — auth vs subscription are different concerns
5. **Pass account to jobs** — no implicit tenant in async context
