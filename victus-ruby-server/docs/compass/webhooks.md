# Webhooks

> SSRF protection, HMAC signatures, delinquency tracking.

## SSRF Protection

Prevent webhooks from hitting internal services:

```ruby
module SsrfProtection
  DISALLOWED_IP_RANGES = [
    IPAddr.new("127.0.0.0/8"), IPAddr.new("10.0.0.0/8"),
    IPAddr.new("172.16.0.0/12"), IPAddr.new("192.168.0.0/16"),
    IPAddr.new("169.254.0.0/16"), IPAddr.new("::1/128"),
  ].freeze

  # Resolve DNS once, pin to that IP (prevents DNS rebinding)
  def perform_safe_request(url, **options)
    uri = URI.parse(url)
    resolved_ip = Resolv.getaddress(uri.host)
    validate_ip!(resolved_ip)

    http = Net::HTTP.new(uri.host, uri.port)
    http.ipaddr = resolved_ip  # Pin to resolved IP
    http.open_timeout = 5
    http.read_timeout = 10
    http.request(build_request(uri, **options))
  end
end
```

## Delivery State Machine

```ruby
class Webhook::Delivery < ApplicationRecord
  enum :status, { pending: 0, delivered: 1, failed: 2, timed_out: 3, error: 4 }

  store :request, accessors: %i[request_url request_headers request_body], coder: JSON
  store :response, accessors: %i[response_code response_headers response_body], coder: JSON

  MAX_RESPONSE_SIZE = 50.kilobytes
end
```

## HMAC-SHA256 Signatures

```ruby
class Webhook < ApplicationRecord
  has_secure_token :signing_secret

  def sign(payload, timestamp:)
    data = "#{timestamp}.#{payload}"
    OpenSSL::HMAC.hexdigest("SHA256", signing_secret, data)
  end
end
```

Headers: `X-Webhook-Signature` + `X-Webhook-Timestamp`

## Delinquency Tracking

Track consecutive failures, pause after threshold:

```ruby
class Webhook::DelinquencyTracker
  DELINQUENCY_THRESHOLD = 10
  DELINQUENCY_DURATION = 1.hour

  def record_delivery_of(delivery)
    delivery.delivered? ? reset : increment
  end

  private
  def increment
    webhook.increment!(:consecutive_failures)
    if webhook.consecutive_failures >= DELINQUENCY_THRESHOLD
      webhook.update!(delinquent_until: DELINQUENCY_DURATION.from_now)
    end
  end
end
```

## Two-Stage Job Pattern

1. **Dispatch job** finds matching webhooks
2. **Delivery job** handles each individually

```ruby
class WebhookDispatchJob < ApplicationJob
  def perform(event:, deliverable:)
    webhooks = deliverable.account.webhooks.active
    webhooks.find_each do |webhook|
      delivery = webhook.deliveries.create!(event: event, status: :pending)
      Webhook::DeliveryJob.perform_later(delivery)
    end
  end
end
```

## Data Retention

```ruby
scope :stale, -> { where(created_at: ...7.days.ago) }
# Purge via recurring job
```

## URL Validation

```ruby
validates :url, presence: true, format: { with: /\Ahttps:\/\//i, message: "must use HTTPS" }
validate :url_is_not_private  # DNS resolve + check against DISALLOWED_IP_RANGES
```

## Key Principles

1. **SSRF protection** — resolve DNS upfront, pin IP, block private ranges
2. **State machine** — track pending/delivered/failed/timed_out/error
3. **Delinquency** — pause after 10 consecutive failures for 1 hour
4. **HMAC signatures** — sign `timestamp.payload`, include both headers
5. **Short timeouts** — 5s open / 10s read
6. **Response size limits** — truncate to prevent DB bloat
7. **HTTPS only** — validate at save time
8. **Automatic cleanup** — purge deliveries older than 7 days
