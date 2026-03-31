# Background Jobs

> Shallow jobs. Error handling patterns. Sidekiq conventions.

## Shallow Jobs

Jobs are thin — delegate to models:

```ruby
class EmailJob < ApplicationJob
  def perform(account, template)
    account.send_email(template)
  end
end
```

## Error Handling

### Transient — retry with backoff

```ruby
retry_on Net::OpenTimeout, Net::ReadTimeout, wait: :polynomially_longer, attempts: 5
retry_on Faraday::TimeoutError, wait: :polynomially_longer
```

### Permanent — swallow, log

```ruby
discard_on ActiveJob::DeserializationError

rescue_from MailerSend::ApiError do |error|
  if error.status == 422  # invalid email, permanent failure
    Rails.logger.warn("Permanent email failure: #{error.message}")
  else
    raise  # re-raise for retry
  end
end
```

## `_later` / `_now` Convention

```ruby
class Account
  def send_welcome_email         # sync — actual work
    MailerSendService.deliver(self, :welcome)
  end

  private

  def send_welcome_email_later   # async — enqueue
    EmailJob.perform_later(self, :welcome)
  end
end
```

## Sidekiq Queues

Organize by priority:

```ruby
class EmailJob < ApplicationJob
  queue_as :default
end

class WebhookDeliveryJob < ApplicationJob
  queue_as :webhooks
end
```

## Idempotency

Jobs may run more than once. Design for it:

```ruby
def perform(habit_check_id)
  check = HabitCheck.find(habit_check_id)
  return if check.notification_sent?  # idempotency guard

  check.send_notification!
end
```

## Maintenance Jobs

- Clean expired tokens periodically
- Clean orphaned data: old audit logs, stale records
- Clean finished Sidekiq jobs via `Sidekiq::DeadSet`

## Key Principles

1. Jobs are thin wrappers — logic lives in models
2. Retry transient errors, discard permanent ones
3. Use `_later`/`_now` naming convention
4. Design for idempotency — jobs may run more than once
5. Organize queues by priority
6. Periodic cleanup of expired/orphaned data
