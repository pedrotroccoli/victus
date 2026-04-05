# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Habit Checks API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }
  let(:habit) { create(:habit, account: account) }

  path '/api/v1/checks' do
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

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end
  end

  path '/api/v1/habits/{habit_id}/checks' do
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

      parameter name: :check_data, in: :body, schema: {
        type: :object,
        properties: {
          checked: { type: :boolean, description: 'Whether the habit was completed' },
          deltas: {
            type: :array,
            items: {
              type: :object,
              properties: {
                habit_delta_id: { type: :string },
                value: { type: :string }
              }
            }
          }
        }
      }

      response '201', 'Check recorded' do
        schema '$ref' => '#/components/schemas/habit_check'

        let(:habit_id) { habit.id.to_s }
        let(:check_data) { { checked: true } }

        run_test!
      end

      response '404', 'Habit not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:habit_id) { BSON::ObjectId.new.to_s }
        let(:check_data) { { checked: true } }

        run_test!
      end
    end
  end

  path '/api/v1/habits/{habit_id}/checks/{id}' do
    parameter name: :habit_id, in: :path, type: :string, description: 'Habit ID'
    parameter name: :id, in: :path, type: :string, description: 'Check ID'

    get 'Get a specific check' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Check found' do
        schema '$ref' => '#/components/schemas/habit_check'

        let(:habit_check) { create(:habit_check, habit: habit, account: account) }
        let(:habit_id) { habit.id.to_s }
        let(:id) { habit_check.id.to_s }

        run_test!
      end

      response '404', 'Check not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:habit_id) { habit.id.to_s }
        let(:id) { BSON::ObjectId.new.to_s }

        run_test!
      end
    end

    put 'Update a check' do
      tags 'Habit Checks'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :check_data, in: :body, schema: {
        type: :object,
        properties: {
          checked: { type: :boolean },
          habit_check_deltas_attributes: {
            type: :array,
            items: {
              type: :object,
              properties: {
                habit_delta_id: { type: :string },
                value: { type: :string },
                _destroy: { type: :boolean }
              }
            }
          }
        }
      }

      response '200', 'Check updated' do
        schema '$ref' => '#/components/schemas/habit_check'

        let(:habit_check) { create(:habit_check, habit: habit, account: account) }
        let(:habit_id) { habit.id.to_s }
        let(:id) { habit_check.id.to_s }
        let(:check_data) { { checked: true } }

        run_test!
      end

      response '404', 'Check not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:habit_id) { habit.id.to_s }
        let(:id) { BSON::ObjectId.new.to_s }
        let(:check_data) { { checked: true } }

        run_test!
      end
    end
  end
end
