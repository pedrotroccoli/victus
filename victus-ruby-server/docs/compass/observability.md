# Observability

> Structured logging, metrics, console auditing.

## Structured JSON Logging

```ruby
config.log_level = :fatal  # suppress unstructured
config.structured_logging.logger = ActiveSupport::Logger.new(STDOUT)
```

## Multi-Tenant Context in Logs

```ruby
before_action { logger.struct tenant: Current.account&.id }
```

## User Context in Logs

```ruby
logger.struct "Authorized User##{session.user.id}",
  authentication: { user: { id: session.user.id } }
```

## Silence Health Checks

```ruby
config.silence_healthcheck_path = "/up"
```

## Console Auditing (Production)

```ruby
gem "console1984"
gem "audits1984"
config.console1984.protected_environments = %i[production staging]
```

## Key Principles

1. Structured JSON logs — queryable, parseable
2. Include tenant/user context in every log entry
3. Silence noise (health checks)
4. Audit console access in production
