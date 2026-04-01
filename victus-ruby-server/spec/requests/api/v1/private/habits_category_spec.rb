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
    end

    post 'Create a category' do
      tags 'Categories'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :category, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          color: { type: :string, description: 'Hex color code' }
        },
        required: %w[name]
      }

      response '201', 'Category created' do
        schema '$ref' => '#/components/schemas/habit_category'

        let(:category) { { name: 'Health', color: '#FF5733' } }

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

      parameter name: :category, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          color: { type: :string }
        }
      }

      response '200', 'Category updated' do
        schema '$ref' => '#/components/schemas/habit_category'

        let(:category_record) { create(:habit_category, account: account) }
        let(:id) { category_record.id.to_s }
        let(:category) { { name: 'Updated Category' } }

        run_test!
      end
    end

    delete 'Delete a category' do
      tags 'Categories'
      security [bearer_auth: []]

      response '204', 'Category deleted' do
        let(:category_record) { create(:habit_category, account: account) }
        let(:id) { category_record.id.to_s }

        run_test!
      end
    end
  end
end
