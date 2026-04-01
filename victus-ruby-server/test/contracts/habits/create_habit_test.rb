require "test_helper"
require_relative "../../../app/contracts/habits/create_habit_contract"

class CreateHabitContractTest < ActiveSupport::TestCase
  def setup
    @contract = CreateHabitContract.new
    @valid_params = {
      name: "Morning Exercise",
      start_date: Date.today,
      recurrence_type: "daily",
      recurrence_details: { frequency: 1 },
      rule_engine_enabled: false
    }
  end

  # Valid scenarios
  test "validates with all required fields and rule_engine_enabled false" do
    result = @contract.call(@valid_params)
    assert result.success?, "Expected contract to be valid with required fields"
  end

  # test "validates with all required fields and optional end_date" do
  #   params = @valid_params.merge(end_date: Date.today + 30.days)
  #   result = @contract.call(params)
  #   assert result.success?, "Expected contract to be valid with end_date"
  # end

  # test "validates with rule_engine_enabled true and valid rule_engine_details with 'and' type" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: {
  #       logic: {
  #         type: "and",
  #         and: [{ condition: "value > 5" }]
  #       }
  #     }
  #   )
  #   result = @contract.call(params)
  #   assert result.success?, "Expected contract to be valid with 'and' rule engine logic"
  # end

  # test "validates with rule_engine_enabled true and valid rule_engine_details with 'or' type" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: {
  #       logic: {
  #         type: "or",
  #         or: [{ condition: "value > 5" }]
  #       }
  #     }
  #   )
  #   result = @contract.call(params)
  #   assert result.success?, "Expected contract to be valid with 'or' rule engine logic"
  # end

  # # Missing required fields
  # test "fails when name is missing" do
  #   params = @valid_params.except(:name)
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without name"
  #   assert result.errors[:name].present?, "Expected error on name field"
  # end

  # test "fails when name is empty string" do
  #   params = @valid_params.merge(name: "")
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with empty name"
  #   assert result.errors[:name].present?, "Expected error on name field"
  # end

  # test "fails when start_date is missing" do
  #   params = @valid_params.except(:start_date)
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without start_date"
  #   assert result.errors[:start_date].present?, "Expected error on start_date field"
  # end

  # test "fails when recurrence_type is missing" do
  #   params = @valid_params.except(:recurrence_type)
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without recurrence_type"
  #   assert result.errors[:recurrence_type].present?, "Expected error on recurrence_type field"
  # end

  # test "fails when recurrence_details is missing" do
  #   params = @valid_params.except(:recurrence_details)
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without recurrence_details"
  #   assert result.errors[:recurrence_details].present?, "Expected error on recurrence_details field"
  # end

  # test "fails when rule_engine_enabled is missing" do
  #   params = @valid_params.except(:rule_engine_enabled)
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without rule_engine_enabled"
  #   assert result.errors[:rule_engine_enabled].present?, "Expected error on rule_engine_enabled field"
  # end

  # # Invalid data types
  # test "fails when start_date is not a date" do
  #   params = @valid_params.merge(start_date: "invalid")
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with invalid start_date"
  #   assert result.errors[:start_date].present?, "Expected error on start_date field"
  # end

  # test "fails when end_date is not a date" do
  #   params = @valid_params.merge(end_date: "invalid")
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with invalid end_date"
  #   assert result.errors[:end_date].present?, "Expected error on end_date field"
  # end

  # test "fails when recurrence_details is not a hash" do
  #   params = @valid_params.merge(recurrence_details: "invalid")
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with invalid recurrence_details"
  #   assert result.errors[:recurrence_details].present?, "Expected error on recurrence_details field"
  # end

  # test "fails when rule_engine_enabled is not a boolean" do
  #   params = @valid_params.merge(rule_engine_enabled: "invalid")
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with invalid rule_engine_enabled"
  #   assert result.errors[:rule_engine_enabled].present?, "Expected error on rule_engine_enabled field"
  # end

  # # Rule engine validation tests
  # test "fails when rule_engine_enabled is true but rule_engine_details is missing" do
  #   params = @valid_params.merge(rule_engine_enabled: true)
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail when rule_engine is enabled without details"
  #   assert result.errors[:rule_engine_details].present?, "Expected error on rule_engine_details field"
  # end

  # test "fails when rule_engine_enabled is true and rule_engine_details is empty hash" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: {}
  #   )
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with empty rule_engine_details"
  #   assert result.errors[:rule_engine_details].include?("logic is required"), 
  #     "Expected 'logic is required' error"
  # end

  # test "fails when rule_engine_enabled is true and logic is missing" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: { other_field: "value" }
  #   )
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without logic"
  #   assert result.errors[:rule_engine_details].include?("logic is required"), 
  #     "Expected 'logic is required' error"
  # end

  # test "fails when rule_engine_enabled is true and logic type is missing" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: {
  #       logic: { some_field: "value" }
  #     }
  #   )
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail without logic type"
  #   assert result.errors[:rule_engine_details].include?("type is required"), 
  #     "Expected 'type is required' error"
  # end

  # test "fails when rule_engine_enabled is true and logic type is invalid" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: {
  #       logic: {
  #         type: "invalid_type",
  #         invalid_type: []
  #       }
  #     }
  #   )
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail with invalid logic type"
  #   assert result.errors[:rule_engine_details].any? { |error| error.include?("type is invalid") }, 
  #     "Expected 'type is invalid' error"
  # end

  # test "fails when rule_engine_enabled is true and logic type condition is not an array" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: true,
  #     rule_engine_details: {
  #       logic: {
  #         type: "and",
  #         and: "not an array"
  #       }
  #     }
  #   )
  #   result = @contract.call(params)
  #   assert result.failure?, "Expected contract to fail when logic condition is not an array"
  #   assert result.errors[:rule_engine_details].any? { |error| error.include?("condition is required and must be an array") },
  #     "Expected 'condition is required and must be an array' error"
  # end

  # test "succeeds when rule_engine_enabled is false regardless of rule_engine_details" do
  #   params = @valid_params.merge(
  #     rule_engine_enabled: false,
  #     rule_engine_details: { invalid: "data" }
  #   )
  #   result = @contract.call(params)
  #   # When rule_engine_enabled is false, rule_engine_details validation is skipped
  #   assert result.success?, "Expected contract to succeed when rule_engine_enabled is false"
  # end
end

