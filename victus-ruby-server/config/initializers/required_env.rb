REQUIRED_ENV_VARS = %w[JWT_SECRET STRIPE_WEBHOOK_SECRET].freeze

missing = REQUIRED_ENV_VARS.select { |var| ENV[var].blank? }

if missing.any? && !Rails.env.test?
  raise "Missing required environment variables: #{missing.join(', ')}"
end
