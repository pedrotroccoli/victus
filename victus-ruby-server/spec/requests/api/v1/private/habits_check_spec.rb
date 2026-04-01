# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Habit Checks API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }
  let(:habit) { create(:habit, account: account) }

  path '/api/v1/habits-check' do
    get 'List all habit checks for account' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      produces 'application/json'

      parameter name: :start_date, in: :query, type: :string, format: :date, required: false,
                description: 'Filter checks from this date'
      parameter name: :end_date, in: :query, type: :string, format: :date, required: false,
                description: 'Filter checks until this date'

      response '200', 'All checks' do
        schema type: :array, items: { '$ref' => '#/components/schemas/habit_check' }

        run_test!
      end
    end
  end

  path '/api/v1/habits-check/{habit_id}' do
    parameter name: :habit_id, in: :path, type: :string, description: 'Habit ID'

    get 'List checks for a specific habit' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Habit checks list' do
        schema type: :array, items: { '$ref' => '#/components/schemas/habit_check' }

        let(:habit_id) { habit.id.to_s }

        run_test!
      end
    end

    post 'Create a habit check' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      description 'Record a habit completion. Validates against RRULE schedule and rule engine conditions.'

      parameter name: :check, in: :body, schema: {
        type: :object,
        properties: {
          checked_at: { type: :string, format: 'date-time', description: 'When the habit was completed' },
          value: { type: :number, description: 'Numeric value for quantifiable habits' },
          notes: { type: :string }
        }
      }

      response '201', 'Check recorded' do
        schema '$ref' => '#/components/schemas/habit_check'

        let(:habit_id) { habit.id.to_s }
        let(:check) { { checked_at: Time.current.iso8601 } }

        run_test!
      end

      response '422', 'Invalid check (not on schedule or rule engine conditions not met)' do
        schema type: :object, properties: {
          error: { type: :string }
        }

        let(:habit_id) { habit.id.to_s }
        let(:check) { { checked_at: 1.year.ago.iso8601 } }

        run_test!
      end
    end
  end

  path '/api/v1/habits-check/{habit_id}/{check_id}' do
    parameter name: :habit_id, in: :path, type: :string, description: 'Habit ID'
    parameter name: :check_id, in: :path, type: :string, description: 'Check ID'

    get 'Get a specific check' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Check found' do
        schema '$ref' => '#/components/schemas/habit_check'

        let(:habit_check) { create(:habit_check, habit: habit) }
        let(:habit_id) { habit.id.to_s }
        let(:check_id) { habit_check.id.to_s }

        run_test!
      end
    end

    put 'Update a check' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :check, in: :body, schema: {
        type: :object,
        properties: {
          value: { type: :number },
          notes: { type: :string }
        }
      }

      response '200', 'Check updated' do
        schema '$ref' => '#/components/schemas/habit_check'

        let(:habit_check) { create(:habit_check, habit: habit) }
        let(:habit_id) { habit.id.to_s }
        let(:check_id) { habit_check.id.to_s }
        let(:check) { { notes: 'Updated note' } }

        run_test!
      end
    end
  end
end
