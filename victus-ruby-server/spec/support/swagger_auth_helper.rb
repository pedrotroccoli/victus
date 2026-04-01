# frozen_string_literal: true

module SwaggerAuthHelper
  def auth_token_for(account)
    payload = { account_id: account.id.to_s, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, ENV['JWT_SECRET'] || 'test_secret')
  end
end

RSpec.configure do |config|
  config.include SwaggerAuthHelper, type: :request
end
