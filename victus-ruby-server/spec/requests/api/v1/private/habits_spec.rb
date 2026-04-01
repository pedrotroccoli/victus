# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Habits API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }

  path '/api/v1/habits' do
    get 'List all habits' do
      tags 'Habits'
      security [bearer_auth: []]
      produces 'application/json'

      parameter name: :category_id, in: :query, type: :string, required: false,
                description: 'Filter by category ID'

      response '200', 'Habits list' do
        schema type: :array, items: { '$ref' => '#/components/schemas/habit' }

        before { create_list(:habit, 3, account: account) }

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end

    post 'Create a habit' do
      tags 'Habits'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :habit, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          description: { type: :string },
          emoji: { type: :string },
          recurrence: { type: :string, description: 'RRULE format (e.g., FREQ=DAILY;INTERVAL=1)' },
          goal: { type: :integer },
          metric: { type: :string },
          category_id: { type: :string },
          rule_engine_enabled: { type: :boolean },
          rule_engine_details: {
            type: :object,
            properties: {
              operator: { type: :string, enum: %w[AND OR] },
              conditions: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    habit_id: { type: :string },
                    completed: { type: :boolean }
                  }
                }
              }
            }
          }
        },
        required: %w[name recurrence]
      }

      response '201', 'Habit created' do
        schema '$ref' => '#/components/schemas/habit'

        let(:habit) { { name: 'Exercise', recurrence: 'FREQ=DAILY;INTERVAL=1' } }

        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object, properties: {
          errors: { type: :object }
        }

        let(:habit) { { name: '' } }

        run_test!
      end
    end
  end

  path '/api/v1/habits/{id}' do
    parameter name: :id, in: :path, type: :string, description: 'Habit ID'

    get 'Get a habit' do
      tags 'Habits'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Habit found' do
        schema '$ref' => '#/components/schemas/habit'

        let(:habit_record) { create(:habit, account: account) }
        let(:id) { habit_record.id.to_s }

        run_test!
      end

      response '404', 'Habit not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { 'nonexistent' }

        run_test!
      end
    end

    put 'Update a habit' do
      tags 'Habits'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :habit, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          description: { type: :string },
          emoji: { type: :string },
          recurrence: { type: :string },
          goal: { type: :integer },
          metric: { type: :string },
          category_id: { type: :string }
        }
      }

      response '200', 'Habit updated' do
        schema '$ref' => '#/components/schemas/habit'

        let(:habit_record) { create(:habit, account: account) }
        let(:id) { habit_record.id.to_s }
        let(:habit) { { name: 'Updated Habit' } }

        run_test!
      end
    end

    delete 'Delete a habit' do
      tags 'Habits'
      security [bearer_auth: []]

      response '204', 'Habit deleted' do
        let(:habit_record) { create(:habit, account: account) }
        let(:id) { habit_record.id.to_s }

        run_test!
      end
    end
  end
end
