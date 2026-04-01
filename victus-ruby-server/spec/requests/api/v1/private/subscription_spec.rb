# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Subscription API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }

  path '/api/v1/subscription' do
    get 'Get current subscription' do
      tags 'Subscription'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Subscription details' do
        schema '$ref' => '#/components/schemas/subscription'

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end
  end

  path '/api/v1/subscription/cancel' do
    post 'Cancel subscription' do
      tags 'Subscription'
      security [bearer_auth: []]
      produces 'application/json'
      description 'Cancel the current Stripe subscription at period end'

      response '200', 'Subscription canceled' do
        schema type: :object, properties: {
          message: { type: :string },
          subscription: { '$ref' => '#/components/schemas/subscription' }
        }

        run_test! do
          pending 'Requires Stripe mock'
        end
      end

      response '400', 'No active subscription' do
        let(:account) { create(:account) }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end
  end

  path '/api/v1/subscription/create_session' do
    post 'Create Stripe checkout session' do
      tags 'Subscription'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      description 'Create a Stripe checkout session for subscription upgrade'

      parameter name: :session_params, in: :body, schema: {
        type: :object,
        properties: {
          price_id: { type: :string, description: 'Stripe price ID' },
          success_url: { type: :string, format: :uri },
          cancel_url: { type: :string, format: :uri }
        },
        required: %w[price_id]
      }

      response '200', 'Session created' do
        schema type: :object, properties: {
          session_id: { type: :string },
          url: { type: :string, format: :uri }
        }

        let(:session_params) { { price_id: 'price_xxx', success_url: 'https://app.com/success' } }

        run_test! do
          pending 'Requires Stripe mock'
        end
      end
    end
  end

  path '/api/v1/plans' do
    get 'List available plans' do
      tags 'Plans'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Plans list' do
        schema type: :array, items: { '$ref' => '#/components/schemas/plan' }

        run_test!
      end
    end
  end

  path '/api/v1/checkout/create' do
    post 'Create checkout session' do
      tags 'Subscription'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :checkout_params, in: :body, schema: {
        type: :object,
        properties: {
          plan_id: { type: :string }
        },
        required: %w[plan_id]
      }

      response '200', 'Checkout session created' do
        schema type: :object, properties: {
          session_id: { type: :string },
          url: { type: :string }
        }

        let(:checkout_params) { { plan_id: 'plan_xxx' } }

        run_test! do
          pending 'Requires Stripe mock'
        end
      end
    end
  end
end
