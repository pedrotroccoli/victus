ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods

  setup do
    Mongoid.purge!
    Rails.cache.clear
  end

  private

  def auth_headers(account)
    payload = { account_id: account.id.to_s, exp: 24.hours.from_now.to_i }
    token = JWT.encode(payload, ENV["JWT_SECRET"] || "test_secret", "HS256")
    { "Authorization" => "Bearer #{token}", "Content-Type" => "application/json" }
  end
end
