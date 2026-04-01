ENV['RAILS_ENV'] ||= 'test'
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods

  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  # fixtures :all  # Disabled: Using MongoDB (Mongoid) instead of ActiveRecord

  # Add more helper methods to be used by all tests here...
end

class ActionDispatch::IntegrationTest
  # Helper method to generate authentication headers for a given account
  def auth_headers(account)
    token = JWT.encode({ account_id: account.id.to_s }, ENV['JWT_SECRET'], 'HS256')
    {
      'Authorization' => "Bearer #{token}",
      'Content-Type' => 'application/json',
      'Accept' => 'application/json'
    }
  end
end
