# Security

> SSRF protection, rate limiting, authorization, API-specific concerns.

## SSRF Protection (for Webhooks/External Calls)

- DNS pinning: resolve once, use pinned IP
- Block private networks (127.0.0.0/8, 10.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.168.0.0/16)
- Validate at creation AND request time

```ruby
DISALLOWED_IP_RANGES = [
  IPAddr.new("127.0.0.0/8"),
  IPAddr.new("10.0.0.0/8"),
  IPAddr.new("169.254.0.0/16"),
  IPAddr.new("172.16.0.0/12"),
  IPAddr.new("192.168.0.0/16"),
  IPAddr.new("::1/128"),
  IPAddr.new("fc00::/7"),
].freeze
```

## Rate Limiting (Rails 7.2+)

```ruby
rate_limit to: 10, within: 15.minutes, only: :create
```

Essential for: auth endpoints, resource creation, webhook dispatch.

## Authorization Pattern

```ruby
# Controller checks
before_action :ensure_can_administer
def ensure_can_administer
  head :forbidden unless @current_account.admin?
end

# Model defines — simple predicate methods, no Pundit
class Account
  def can_edit_habit?(habit)
    habit.account_id == self.id
  end
end
```

## Multi-Tenancy Security

- **Scope all queries** through `@current_account` — never trust client-provided IDs
- Every private controller inherits `ActiveAndAuthorized` which sets `@current_account`
- Return 404 (not 403) for resources belonging to other accounts — don't leak existence

## Webhook Signatures (HMAC-SHA256)

```ruby
def sign(payload, timestamp:)
  data = "#{timestamp}.#{payload}"
  OpenSSL::HMAC.hexdigest("SHA256", signing_secret, data)
end
```

## Specific Error Classes

```ruby
class Subscription::InactiveError < StandardError; end

def check_subscription
  raise Subscription::InactiveError unless @current_account.subscription_active?
end

# Controller
rescue_from Subscription::InactiveError do
  render json: { error: "Subscription required" }, status: :payment_required
end
```

## API-Specific Concerns

- **CORS**: Configure `rack-cors` with explicit origins, not `*`
- **JSON-only**: Reject non-JSON content types
- **Parameter filtering**: Log sanitization for sensitive fields (tokens, passwords)
- **JWT expiration**: Short-lived tokens (24h), no refresh token without rotation

## Key Principles

1. Scope all queries through current account
2. Rate limit auth and creation endpoints
3. Authorization as model predicates, not policy objects
4. 404 over 403 for cross-tenant access
5. HMAC signatures for webhooks
6. Specific error classes with meaningful HTTP status codes
