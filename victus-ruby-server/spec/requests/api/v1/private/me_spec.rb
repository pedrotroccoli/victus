# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Me API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }

  path '/api/v1/me' do
    get 'Get current user profile' do
      tags 'Account'
      security [bearer_auth: []]
      produces 'application/json'
      description 'Returns the current user profile. Does not require active subscription.'

      response '200', 'Profile retrieved' do
        schema type: :object, properties: {
          id: { type: :string },
          name: { type: :string },
          email: { type: :string },
          phone: { type: :string, nullable: true },
          connected_providers: { type: :array, items: { type: :string } },
          subscription: { '$ref' => '#/components/schemas/subscription' }
        }

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end

    put 'Update current user profile' do
      tags 'Account'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :profile_data, in: :body, schema: {
        type: :object,
        required: %w[account],
        properties: {
          account: {
            type: :object,
            properties: {
              name: { type: :string },
              phone: { type: :string }
            }
          },
          password: { type: :string },
          password_confirmation: { type: :string }
        }
      }

      response '200', 'Profile updated' do
        schema type: :object, properties: {
          id: { type: :string },
          name: { type: :string },
          email: { type: :string },
          phone: { type: :string, nullable: true },
          connected_providers: { type: :array, items: { type: :string } },
          subscription: { '$ref' => '#/components/schemas/subscription' }
        }

        let(:profile_data) { { account: { name: 'Updated Name' } } }

        run_test!
      end

      response '422', 'Password mismatch' do
        schema type: :object, properties: {
          code: { type: :string }
        }

        let(:profile_data) { { password: 'new123', password_confirmation: 'mismatch', account: { name: 'Test' } } }

        run_test!
      end
    end
  end
end
