require 'rails_helper'
require_relative '../../../app/contracts/habits/create_habit_contract'

RSpec.describe Habits::CreateHabitContract, type: :contract do
  let(:contract) { described_class.new }
  
  let(:valid_params) do
    {
      name: "Morning Exercise",
      start_date: Date.today,
      recurrence_type: "daily",
      recurrence_details: { rule: "FREQ=DAILY;INTERVAL=1" },
      rule_engine_enabled: false
    }
  end

  describe 'valid scenarios' do
    it 'validates with all required fields and rule_engine_enabled false' do
      result = contract.call(valid_params)
      
      expect(result).to be_success
    end

    it 'validates with all required fields and optional end_date' do
      params = valid_params.merge(end_date: Date.today + 30.days)
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'validates with rule_engine_enabled true and valid rule_engine_details with "and" type' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: {
            type: "and",
            and: ["condition1", "condition2"]
          }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'validates with rule_engine_enabled true and valid rule_engine_details with "or" type' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: {
            type: "or",
            or: ["condition1", "condition2"]
          }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'validates with rule_engine_enabled false regardless of rule_engine_details' do
      params = valid_params.merge(
        rule_engine_enabled: false,
        rule_engine_details: { invalid: "data" }
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end
  end

  describe 'missing required fields' do
    it 'fails when name is missing' do
      params = valid_params.except(:name)
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:name]).to be_present
    end

    it 'fails when name is empty string' do
      params = valid_params.merge(name: "")
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:name]).to be_present
    end

    it 'fails when start_date is missing' do
      params = valid_params.except(:start_date)
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:start_date]).to be_present
    end

    it 'fails when recurrence_type is missing' do
      params = valid_params.except(:recurrence_type)
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:recurrence_type]).to be_present
    end

    it 'fails when recurrence_details is missing' do
      params = valid_params.except(:recurrence_details)
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:recurrence_details]).to be_present
    end

    it 'fails when rule_engine_enabled is missing' do
      params = valid_params.except(:rule_engine_enabled)
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_enabled]).to be_present
    end
  end

  describe 'invalid data types' do
    it 'fails when start_date is not a date' do
      params = valid_params.merge(start_date: "invalid")
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:start_date]).to be_present
    end

    it 'fails when end_date is not a date' do
      params = valid_params.merge(end_date: "invalid")
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:end_date]).to be_present
    end

    it 'fails when recurrence_details is not a hash' do
      params = valid_params.merge(recurrence_details: "invalid")
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:recurrence_details]).to be_present
    end

    it 'fails when rule_engine_enabled is not a boolean' do
      params = valid_params.merge(rule_engine_enabled: "invalid")
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_enabled]).to be_present
    end
  end

  describe 'rule_engine_details validation' do
    it 'fails when rule_engine_enabled is true but rule_engine_details is missing' do
      params = valid_params.merge(rule_engine_enabled: true)
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].first).to include('logic is required')
    end

    it 'fails when rule_engine_enabled is true and rule_engine_details is empty hash' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          abc: "value"
        }
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].first).to include('logic is required')
    end

    it 'fails when rule_engine_enabled is true and logic is missing' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: { other_field: "value" }
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].first).to include('logic is required')
    end

    it 'fails when rule_engine_enabled is true and logic type is missing' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: { some_field: "value" }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].first).to include('type is required')
    end

    it 'fails when rule_engine_enabled is true and logic type is invalid' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: {
            type: "invalid_type",
            invalid_type: []
          }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].any? { |error| error.include?('type is invalid') }).to be true
    end

    it 'fails when rule_engine_enabled is true and logic type condition is not an array' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: {
            type: "and",
            and: "not an array"
          }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].any? { |error| error.include?('condition is required and must be an array') }).to be true
    end

    it 'fails when rule_engine_enabled is true and logic type condition contains non-string elements' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: {
            type: "and",
            and: [1, 2, 3]
          }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:rule_engine_details]).to be_present
      expect(result.errors[:rule_engine_details].any? { |error| error.include?('must be an array of strings') }).to be true
    end

    it 'allows empty array for logic type condition' do
      params = valid_params.merge(
        rule_engine_enabled: true,
        rule_engine_details: {
          logic: {
            type: "and",
            and: []
          }
        }
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end
  end

  describe 'date validations' do
    it 'fails when start_date is in the past' do
      params = valid_params.merge(
        start_date: Date.today - 1.day
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:start_date]).to be_present
      expect(result.errors[:start_date].first).to include('must be today or in the future')
    end

    it 'succeeds when start_date is today' do
      params = valid_params.merge(
        start_date: Date.today
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'succeeds when start_date is in the future' do
      params = valid_params.merge(
        start_date: Date.today + 1.day
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'fails when start_date is greater than end_date' do
      params = valid_params.merge(
        start_date: Date.today + 30.days,
        end_date: Date.today + 10.days
      )
      result = contract.call(params)
      
      expect(result).to be_failure
      expect(result.errors[:start_date]).to be_present
      expect(result.errors[:start_date].first).to include('must be before end_date')
      expect(result.errors[:end_date]).to be_present
      expect(result.errors[:end_date].first).to include('must be after start_date')
    end

    it 'succeeds when start_date equals end_date' do
      today = Date.today
      params = valid_params.merge(
        start_date: today,
        end_date: today
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'succeeds when start_date is before end_date' do
      params = valid_params.merge(
        start_date: Date.today,
        end_date: Date.today + 30.days
      )
      result = contract.call(params)
      
      expect(result).to be_success
    end

    it 'succeeds when only start_date is provided' do
      params = valid_params.except(:end_date)
      result = contract.call(params)
      
      expect(result).to be_success
    end
  end
end

