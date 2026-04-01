require "test_helper"

module Private
  class HabitsControllerTest < ActionDispatch::IntegrationTest
    def setup
      @account = create(:account, :with_active_subscription)
      @habit = create(:habit, account: @account)
      @headers = auth_headers(@account)
    end

    test "should update habit successfully" do
      update_params = {
        habit: {
          name: "Updated Exercise",
          order: 2.0,
          delta_enabled: true
        }
      }

      put "/api/v1/habits/#{@habit.id}", 
          params: update_params.to_json, 
          headers: @headers

      assert_response :ok
      
      json_response = JSON.parse(response.body)

      assert_equal "Updated Exercise", json_response["name"]
      assert_equal 2.0, json_response["order"]
      assert_equal true, json_response["delta_enabled"]

      assert_nil json_response["habit_category"]
      assert_nil json_response["paused_at"]
      assert_nil json_response["finished_at"]
    end

    # test "should update habit with recurrence_details" do
    #   update_params = {
    #     habit: {
    #       name: "Updated Exercise",
    #       recurrence_type: "weekly",
    #       recurrence_details: { rule: "FREQ=WEEKLY;BYDAY=MO" }
    #     }
    #   }

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: @headers

    #   assert_response :ok
      
    #   json_response = JSON.parse(response.body)
    #   assert_equal "Updated Exercise", json_response["name"]
    #   assert_equal "weekly", json_response["recurrence_type"]
    # end

    # test "should update habit with habit_deltas_attributes" do
    #   # Create an existing delta
    #   delta = create(:habit_delta, habit: @habit)

    #   update_params = {
    #     habit: {
    #       name: "Updated Exercise",
    #       habit_deltas_attributes: [
    #         {
    #           id: delta.id.to_s,
    #           name: "Updated Duration",
    #           description: "Updated description",
    #           enabled: false
    #         }
    #       ]
    #     }
    #   }

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: @headers

    #   assert_response :ok
      
    #   json_response = JSON.parse(response.body)
    #   assert_equal "Updated Exercise", json_response["name"]
      
    #   # Reload habit to check deltas
    #   @habit.reload
    #   updated_delta = @habit.habit_deltas.find(delta.id)
    #   assert_equal "Updated Duration", updated_delta.name
    #   assert_equal "Updated description", updated_delta.description
    #   assert_equal false, updated_delta.enabled
    # end

    # test "should update habit with paused_at and finished_at" do
    #   paused_time = Time.current
    #   finished_time = Time.current + 1.hour

    #   update_params = {
    #     habit: {
    #       paused_at: paused_time.iso8601,
    #       finished_at: finished_time.iso8601
    #     }
    #   }

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: @headers

    #   assert_response :ok
      
    #   json_response = JSON.parse(response.body)
    #   @habit.reload
    #   assert_not_nil @habit.paused_at
    #   assert_not_nil @habit.finished_at
    # end

    # test "should return unprocessable_entity when update fails validation" do
    #   update_params = {
    #     habit: {
    #       name: "" # Empty name should fail validation
    #     }
    #   }

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: @headers

    #   assert_response :unprocessable_entity
      
    #   json_response = JSON.parse(response.body)
    #   assert json_response["errors"].present?
    #   assert json_response["errors"].any? { |error| error.include?("name") }
    # end

    # test "should not update habit from different account" do
    #   # Create another account
    #   other_account = create(:account, :with_active_subscription)

    #   update_params = {
    #     habit: {
    #       name: "Hacked Name"
    #     }
    #   }

    #   # Try to update with other account's token
    #   other_headers = auth_headers(other_account)

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: other_headers

    #   # Should return not found since habit doesn't belong to other_account
    #   assert_response :not_found
    # end

    # test "should return unauthorized without token" do
    #   update_params = {
    #     habit: {
    #       name: "Updated Name"
    #     }
    #   }

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: { 'Content-Type' => 'application/json' }

    #   assert_response :unauthorized
    # end

    # test "should return not_found for non-existent habit" do
    #   fake_id = BSON::ObjectId.new
    #   update_params = {
    #     habit: {
    #       name: "Updated Name"
    #     }
    #   }

    #   put "/api/v1/habits/#{fake_id}", params: update_params.to_json, headers: @headers

    #   assert_response :not_found
    # end

    # test "should delete habit_delta using _destroy flag" do
    #   # Create a delta to delete
    #   delta = create(:habit_delta, habit: @habit, name: "To Delete", description: "This will be deleted")

    #   delta_id = delta.id.to_s

    #   update_params = {
    #     habit: {
    #       name: "Updated Exercise",
    #       habit_deltas_attributes: [
    #         {
    #           id: delta_id,
    #           _destroy: true
    #         }
    #       ]
    #     }
    #   }

    #   put "/api/v1/habits/#{@habit.id}", params: update_params.to_json, headers: @headers

    #   assert_response :ok
      
    #   # Reload habit and verify delta is deleted
    #   @habit.reload
    #   assert_nil @habit.habit_deltas.find_by(id: delta_id)
    # end
  end
end
