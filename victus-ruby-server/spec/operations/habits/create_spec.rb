require 'rails_helper'

RSpec.describe Habits::Create, type: :operation do
  let(:account) { create(:account) }
  
  let(:valid_params) do
    {
      name: "Morning Exercise",
      description: "Daily workout routine",
      start_date: Date.today,
      recurrence_type: :daily,
      recurrence_details: { rule: "FREQ=DAILY;INTERVAL=1" },
      rule_engine_enabled: false
    }
  end

  describe 'successful creation' do
    it 'creates a habit with valid params' do
      result = described_class.call(params: valid_params, account: account)
      
      expect(result).to be_success
      expect(result[:habit]).to be_persisted
      expect(result[:habit].name).to eq("Morning Exercise")
      expect(result[:habit].account_id).to eq(account.id)
      expect(result[:habit].start_date.to_date).to eq(Date.today)
      expect(result[:habit].recurrence_type).to eq("daily")
    end

    it 'creates a habit with end_date' do
      params = valid_params.merge(end_date: Date.today + 30.days)
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].end_date.to_date).to eq(Date.today + 30.days)
    end

    it 'creates a habit with habit_deltas' do
      params = valid_params.merge(
        habit_deltas: [
          {
            type: "number",
            name: "Duration",
            description: "Exercise duration in minutes",
            enabled: true
          }
        ]
      )
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].habit_deltas.count).to eq(1)
      expect(result[:habit].habit_deltas.first.name).to eq("Duration")
      expect(result[:habit].habit_deltas.first.type).to eq("number")
    end

    it 'creates a habit with multiple habit_deltas' do
      params = valid_params.merge(
        habit_deltas: [
          {
            type: "number",
            name: "Duration",
            enabled: true
          },
          {
            type: "time",
            name: "Start Time",
            enabled: true
          }
        ]
      )
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].habit_deltas.count).to eq(2)
    end

    it 'creates habit with habit_deltas when provided' do
      params = valid_params.merge(
        habit_deltas: [{ type: "number", name: "Test" }]
      )
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].habit_deltas.count).to eq(1)
      expect(result[:habit].habit_deltas.first.type).to eq("number")
      expect(result[:habit].habit_deltas.first.name).to eq("Test")
    end
  end

  describe 'validation failures' do
    it 'fails when account is missing' do
      result = described_class.call(params: valid_params, account: nil)
      
      expect(result).to be_failure
      expect(result[:errors]).to include("Account is required")
    end

    it 'fails when contract validation fails - missing name' do
      params = valid_params.except(:name)
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to be_present
    end

    it 'fails when contract validation fails - invalid start_date' do
      params = valid_params.merge(start_date: Date.today - 1.day)
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to be_present
    end

    it 'fails when contract validation fails - start_date after end_date' do
      params = valid_params.merge(
        start_date: Date.today + 30.days,
        end_date: Date.today + 10.days
      )
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to be_present
    end

    it 'fails when contract validation fails - missing recurrence_type' do
      params = valid_params.except(:recurrence_type)
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to be_present
    end

    it 'fails when contract validation fails - missing recurrence_details' do
      params = valid_params.except(:recurrence_details)
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to be_present
    end

    it 'fails when contract validation fails - invalid recurrence_type' do
      params = valid_params.merge(recurrence_type: :invalid_type)
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to be_present
    end
  end

  describe 'habit model validation failures' do
    it 'fails when habit cannot be saved' do
      # Create a habit that will fail model validation
      # We'll stub the save to return false
      allow_any_instance_of(Habit).to receive(:save).and_return(false)
      allow_any_instance_of(Habit).to receive(:errors).and_return(
        double(full_messages: ["Name is invalid"])
      )
      
      result = described_class.call(params: valid_params, account: account)
      
      expect(result).to be_failure
      expect(result[:errors]).to include(["Name is invalid"])
    end
  end

  describe 'habit_deltas handling' do
    it 'skips building habit_deltas when not provided' do
      result = described_class.call(params: valid_params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].habit_deltas).to be_empty
    end

    it 'builds habit_deltas when provided' do
      params = valid_params.merge(
        habit_deltas: [
          {
            type: "number",
            name: "Count",
            enabled: true
          }
        ]
      )
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].habit_deltas.count).to eq(1)
      expect(result[:habit].habit_deltas.first.name).to eq("Count")
    end

    it 'handles empty habit_deltas array' do
      params = valid_params.merge(habit_deltas: [])
      result = described_class.call(params: params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].habit_deltas).to be_empty
    end
  end

  describe 'account assignment' do
    it 'assigns the account to the habit' do
      result = described_class.call(params: valid_params, account: account)
      
      expect(result).to be_success
      expect(result[:habit].account_id).to eq(account.id)
      expect(result[:habit].account).to eq(account)
    end
  end
end

