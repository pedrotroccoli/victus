require "test_helper"

module Private
  class HabitsCheckControllerTest < ActionDispatch::IntegrationTest
    def setup
      @account = create(:account, :with_active_subscription)
      @habit = create(:habit, account: @account)
      @headers = auth_headers(@account)
    end

    # GET /api/v1/checks
    test "should list all checks for the account" do
      create(:habit_check, :checked, habit: @habit, account: @account)

      get "/api/v1/checks", headers: @headers

      assert_response :ok
      json_response = JSON.parse(response.body)
      assert_kind_of Array, json_response
      assert_equal 1, json_response.length
    end

    test "should filter checks by date range" do
      create(:habit_check, :checked, habit: @habit, account: @account)

      get "/api/v1/checks",
          params: { start_date: Date.today.to_s, end_date: Date.today.to_s },
          headers: @headers

      assert_response :ok
    end

    test "should return unauthorized without token for checks" do
      get "/api/v1/checks", headers: { 'Content-Type' => 'application/json' }

      assert_response :unauthorized
    end

    # GET /api/v1/habits/:habit_id/checks
    test "should list checks for a specific habit" do
      create(:habit_check, :checked, habit: @habit, account: @account)

      get "/api/v1/habits/#{@habit.id}/checks", headers: @headers

      assert_response :ok
      json_response = JSON.parse(response.body)
      assert_kind_of Array, json_response
    end

    # GET /api/v1/habits/:habit_id/checks/:id
    test "should show a specific check" do
      check = create(:habit_check, :checked, habit: @habit, account: @account)

      get "/api/v1/habits/#{@habit.id}/checks/#{check.id}", headers: @headers

      assert_response :ok
      json_response = JSON.parse(response.body)
      assert_equal check.id.to_s, json_response["_id"]
    end

    # POST /api/v1/habits/:habit_id/checks
    test "should create a habit check" do
      post "/api/v1/habits/#{@habit.id}/checks",
           params: { checked: true }.to_json,
           headers: @headers

      assert_response :created
      json_response = JSON.parse(response.body)
      assert_equal true, json_response["checked"]
      assert_equal @habit.id.to_s, json_response["habit_id"]
    end

    # PUT /api/v1/habits/:habit_id/checks/:id
    test "should update a habit check" do
      check = create(:habit_check, habit: @habit, account: @account)

      put "/api/v1/habits/#{@habit.id}/checks/#{check.id}",
          params: { checked: true }.to_json,
          headers: @headers

      assert_response :ok
      json_response = JSON.parse(response.body)
      assert_equal true, json_response["checked"]
    end
  end
end
