# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Habit Categories API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }

  path '/api/v1/habits_category' do
    get 'List all categories' do
      tags 'Categories'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Categories list' do
        schema type: :array, items: { '$ref' => '#/components/schemas/habit_category' }

        before { create_list(:habit_category, 3, account: account) }

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end

    post 'Create a category' do
      tags 'Categories'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :category_data, in: :body, schema: {
        type: :object,
        required: %w[habits_category],
        properties: {
          habits_category: {
            type: :object,
            properties: {
              name: { type: :string },
              order: { type: :number },
              icon: { type: :string }
            },
            required: %w[name]
          }
        }
      }

      response '201', 'Category created' do
        schema '$ref' => '#/components/schemas/habit_category'

        let(:category_data) { { habits_category: { name: 'Health' } } }

        run_test!
      end
    end
  end

  path '/api/v1/habits_category/{id}' do
    parameter name: :id, in: :path, type: :string, description: 'Category ID'

    put 'Update a category' do
      tags 'Categories'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :category_data, in: :body, schema: {
        type: :object,
        required: %w[habits_category],
        properties: {
          habits_category: {
            type: :object,
            properties: {
              name: { type: :string },
              order: { type: :number },
              icon: { type: :string }
            }
          }
        }
      }

      response '200', 'Category updated' do
        schema '$ref' => '#/components/schemas/habit_category'

        let(:category_record) { create(:habit_category, account: account) }
        let(:id) { category_record.id.to_s }
        let(:category_data) { { habits_category: { name: 'Updated Category' } } }

        run_test!
      end

      response '404', 'Category not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { BSON::ObjectId.new.to_s }
        let(:category_data) { { habits_category: { name: 'Test' } } }

        run_test!
      end

      response '422', 'Validation error' do
        schema type: :object, properties: {
          errors: { type: :array, items: { type: :string } }
        }

        let(:category_record) { create(:habit_category, account: account) }
        let(:other_category) { create(:habit_category, account: account, name: 'Taken') }
        let(:id) { category_record.id.to_s }
        let(:category_data) { { habits_category: { name: other_category.name } } }

        run_test!
      end
    end

    delete 'Delete a category' do
      tags 'Categories'
      security [bearer_auth: []]
      produces 'application/json'

      response '204', 'Category deleted' do
        let(:category_record) { create(:habit_category, account: account) }
        let(:id) { category_record.id.to_s }

        run_test!
      end

      response '404', 'Category not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { BSON::ObjectId.new.to_s }

        run_test!
      end
    end
  end
end
