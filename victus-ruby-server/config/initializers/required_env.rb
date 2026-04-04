required_env_vars = %w[JWT_SECRET STRIPE_WEBHOOK_SECRET].freeze

missing = required_env_vars.select { |var| ENV[var].blank? }

if missing.any? && !Rails.env.test?
  raise "Missing required environment variables: #{missing.join(', ')}"
end
