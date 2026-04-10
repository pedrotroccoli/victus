require "test_helper"

module Private
  class RateLimitTest < ActionDispatch::IntegrationTest
    def setup
      @account = create(:account, :with_active_subscription)
      @headers = auth_headers(@account)
    end

    test "returns 429 after exceeding per-user rate limit" do
      61.times do
        get "/api/v1/habits", headers: @headers
      end

      assert_response :too_many_requests
      json_response = JSON.parse(response.body)
      assert_includes json_response["error"], "Rate limit"
      assert_equal "60", response.headers["Retry-After"]
    end

    test "allows requests under the rate limit" do
      60.times do
        get "/api/v1/habits", headers: @headers
      end

      assert_response :ok
    end
  end
end
