# Authentication

> Own your auth. Separate identity from membership. Keep it simple.

## Why Not Devise

- Custom auth is easier to understand, debug, and modify
- You own every line — no black-box middleware
- Devise is overkill for API-only backends

## Identity vs Account Separation

Identity = the person (auth credentials). Account = membership + subscription.

One person can have multiple auth methods (email/password, Web3 wallet) while belonging to the same account. This separation keeps auth concerns out of business logic.

```ruby
# Auth credentials live on Account (or a separate Identity model)
# Business data (habits, subscriptions) also live on Account
# The JWT concern only cares about finding the account — not how they signed up
```

## Declarative Auth DSL

Controllers declare auth requirements at class level:

```ruby
# Private controllers — require JWT + active subscription
class Api::V1::Private::HabitsController < ApplicationController
  include ActiveAndAuthorized  # before_action :authorize_request + :check_subscription
end

# Public controllers — no auth required
class Api::V1::Public::AuthController < ApplicationController
  # No auth concern included
end
```

The pattern: a concern that sets `@current_account` from the JWT, then a subscription check that returns 402 if inactive.

## Token-Based Auth for APIs

APIs use stateless JWT tokens, not cookies/sessions:

```ruby
# Encode
JWT.encode({ account_id: account.id, exp: 24.hours.from_now.to_i }, jwt_secret)

# Decode + find account
decoded = JWT.decode(token, jwt_secret)
@current_account = Account.find(decoded["account_id"])
```

No session state on the server. No cookies. Every request carries its own auth.

## Rate Limiting Auth Endpoints

```ruby
rate_limit to: 10, within: 3.minutes, only: :create, with: -> {
  render json: { error: "Try again later" }, status: :too_many_requests
}
```

## Key Principles

1. **Own your auth code** — a concern + JWT encode/decode is all you need
2. **Separate identity from membership** — auth method != business entity
3. **Stateless tokens for APIs** — JWT, no server-side sessions
4. **Declarative auth DSL** — `include ActiveAndAuthorized` reads like a spec
5. **Rate limit auth endpoints** — built-in Rails `rate_limit`
6. **402 for subscription checks** — separate auth (401) from payment (402)
