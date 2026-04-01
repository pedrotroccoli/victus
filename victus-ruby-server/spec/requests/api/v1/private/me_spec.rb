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

      response '200', 'Profile retrieved' do
        schema type: :object, properties: {
          account: { '$ref' => '#/components/schemas/account' },
          subscription: { '$ref' => '#/components/schemas/subscription' }
        }

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '402', 'Subscription required' do
        let(:account) { create(:account) }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end

    put 'Update current user profile' do
      tags 'Account'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :profile, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          email: { type: :string, format: :email }
        }
      }

      response '200', 'Profile updated' do
        schema '$ref' => '#/components/schemas/account'

        let(:profile) { { name: 'Updated Name' } }

        run_test!
      end
    end
  end
end
