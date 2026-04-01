require "test_helper"

module Private
  class SubscriptionControllerTest < ActionDispatch::IntegrationTest
    def setup
      @account = create(:account, :with_active_subscription)
      @headers = auth_headers(@account)
    end

    # GET /api/v1/subscription
    test "should return unauthorized without token" do
      get "/api/v1/subscription", headers: { 'Content-Type' => 'application/json' }

      assert_response :unauthorized
    end

    test "should return payment required without active subscription" do
      account = create(:account)
      headers = auth_headers(account)

      get "/api/v1/subscription", headers: headers

      assert_response :payment_required
    end
  end

  class SubscriptionCancellationsControllerTest < ActionDispatch::IntegrationTest
    def setup
      @account = create(:account, :with_active_subscription)
      @headers = auth_headers(@account)
    end

    # POST /api/v1/subscription/cancellation
    test "should return unauthorized without token" do
      post "/api/v1/subscription/cancellation", headers: { 'Content-Type' => 'application/json' }

      assert_response :unauthorized
    end

    test "should return unprocessable when no stripe subscription id" do
      post "/api/v1/subscription/cancellation",
           params: {}.to_json,
           headers: @headers

      assert_response :unprocessable_entity
    end
  end

  class SubscriptionPortalSessionsControllerTest < ActionDispatch::IntegrationTest
    def setup
      @account = create(:account, :with_active_subscription)
      @headers = auth_headers(@account)
    end

    # POST /api/v1/subscription/portal_session
    test "should return unauthorized without token" do
      post "/api/v1/subscription/portal_session", headers: { 'Content-Type' => 'application/json' }

      assert_response :unauthorized
    end

    test "should return unprocessable when no customer id" do
      post "/api/v1/subscription/portal_session",
           params: {}.to_json,
           headers: @headers

      assert_response :unprocessable_entity
    end
  end
end
