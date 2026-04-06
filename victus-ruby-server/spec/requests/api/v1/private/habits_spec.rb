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
        required: %w[habit],
        properties: {
          habit: {
            type: :object,
            properties: {
              name: { type: :string },
              description: { type: :string },
              start_date: { type: :string, format: :date },
              end_date: { type: :string, format: :date },
              order: { type: :number },
              recurrence_type: { type: :string, enum: %w[daily weekly monthly yearly infinite] },
              recurrence_details: {
                type: :object,
                properties: { rule: { type: :string, description: 'RRULE format (e.g., FREQ=DAILY)' } },
                required: %w[rule]
              },
              delta_enabled: { type: :boolean },
              rule_engine_enabled: { type: :boolean },
              rule_engine_details: { type: :object, nullable: true },
              habit_category_id: { type: :string },
              parent_habit_id: { type: :string }
            },
            required: %w[name start_date recurrence_type recurrence_details rule_engine_enabled]
          }
        }
      }

      response '201', 'Habit created' do
        schema '$ref' => '#/components/schemas/habit'

        let(:habit) do
          {
            habit: {
              name: 'Exercise',
              recurrence_type: 'daily',
              recurrence_details: { rule: 'FREQ=DAILY' },
              start_date: (Date.today + 1).to_s,
              rule_engine_enabled: false
            }
          }
        end

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        let(:habit) { { habit: { name: 'Test' } } }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object, properties: {
          errors: { type: :array, items: { type: :array, items: { type: :object } } }
        }

        let(:habit) do
          {
            habit: {
              name: '',
              recurrence_type: 'daily',
              recurrence_details: { rule: 'FREQ=DAILY' },
              start_date: (Date.today + 1).to_s,
              rule_engine_enabled: false
            }
          }
        end

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

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        let(:id) { BSON::ObjectId.new.to_s }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '404', 'Habit not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { BSON::ObjectId.new.to_s }

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
        required: %w[habit],
        properties: {
          habit: {
            type: :object,
            properties: {
              name: { type: :string },
              order: { type: :number },
              recurrence_type: { type: :string },
              recurrence_details: { type: :object, properties: { rule: { type: :string } } },
              habit_category_id: { type: :string },
              delta_enabled: { type: :boolean },
              rule_engine_enabled: { type: :boolean },
              paused: { type: :boolean },
              finished: { type: :boolean }
            }
          }
        }
      }

      response '200', 'Habit updated' do
        schema '$ref' => '#/components/schemas/habit'

        let(:habit_record) { create(:habit, account: account) }
        let(:id) { habit_record.id.to_s }
        let(:habit) { { habit: { name: 'Updated Habit' } } }

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        let(:id) { BSON::ObjectId.new.to_s }
        let(:habit) { { habit: { name: 'Test' } } }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '404', 'Habit not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { BSON::ObjectId.new.to_s }
        let(:habit) { { habit: { name: 'Test' } } }

        run_test!
      end

      response '422', 'Validation error' do
        schema type: :object, properties: {
          errors: { type: :array, items: { type: :string } }
        }

        let(:habit_record) { create(:habit, account: account) }
        let(:id) { habit_record.id.to_s }
        let(:habit) { { habit: { name: '' } } }

        run_test!
      end
    end

    delete 'Delete a habit' do
      tags 'Habits'
      security [bearer_auth: []]
      produces 'application/json'

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        let(:id) { BSON::ObjectId.new.to_s }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '200', 'Habit deleted' do
        schema type: :object, properties: {
          message: { type: :string }
        }

        let(:habit_record) { create(:habit, account: account) }
        let(:id) { habit_record.id.to_s }

        run_test!
      end

      response '404', 'Habit not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { BSON::ObjectId.new.to_s }

        run_test!
      end
    end
  end
end
