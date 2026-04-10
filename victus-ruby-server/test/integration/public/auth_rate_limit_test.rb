require "test_helper"

module Public
  class AuthRateLimitTest < ActionDispatch::IntegrationTest
    # POST /api/v1/auth/sign-in
    test "returns 429 after exceeding sign-in rate limit" do
      11.times do
        post "/api/v1/auth/sign-in",
             params: { account: { email: "test@test.com", password: "wrong" } }.to_json,
             headers: { "Content-Type" => "application/json" }
      end

      assert_response :too_many_requests
      json_response = JSON.parse(response.body)
      assert_includes json_response["error"], "Rate limit"
      assert_equal "180", response.headers["Retry-After"]
    end

    # POST /api/v1/auth/sign-up
    test "returns 429 after exceeding sign-up rate limit" do
      6.times do |i|
        post "/api/v1/auth/sign-up",
             params: { account: { name: "User #{i}", email: "user#{i}@test.com", password: "password123", password_confirmation: "password123" } }.to_json,
             headers: { "Content-Type" => "application/json" }
      end

      assert_response :too_many_requests
      json_response = JSON.parse(response.body)
      assert_includes json_response["error"], "Rate limit"
    end

    test "allows requests under the sign-in rate limit" do
      10.times do
        post "/api/v1/auth/sign-in",
             params: { account: { email: "test@test.com", password: "wrong" } }.to_json,
             headers: { "Content-Type" => "application/json" }
      end

      assert_response :unauthorized
    end
  end
end
