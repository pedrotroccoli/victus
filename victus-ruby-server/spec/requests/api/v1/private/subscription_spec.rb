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
        schema type: :object, properties: {
          status: { type: :string },
          sub_status: { type: :string },
          service_type: { type: :string },
          cancel_date: { type: :string, nullable: true },
          cancel_reason: { type: :string, nullable: true },
          current_period_end: { type: :integer, nullable: true },
          cancel_at_period_end: { type: :boolean, nullable: true },
          trial_end: { type: :integer, nullable: true }
        }

        run_test!
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end
  end

  path '/api/v1/subscription/cancellation' do
    post 'Cancel subscription' do
      tags 'Subscription'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      description 'Cancel the current Stripe subscription'

      parameter name: :cancel_data, in: :body, schema: {
        type: :object,
        properties: {
          immediate: { type: :boolean, description: 'Cancel immediately or at period end' },
          reason: { type: :string, description: 'Cancellation reason' }
        }
      }, required: false

      response '200', 'Subscription canceled' do
        schema type: :object, properties: {
          message: { type: :string },
          cancel_at: { type: :integer, nullable: true }
        }

        let(:cancel_data) { {} }

        it 'returns a 200 response' do |example|
          pending 'Requires Stripe mock'
          submit_request(example.metadata)
          assert_response_matches_metadata(example.metadata)
        end
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        let(:cancel_data) { {} }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '402', 'No active subscription' do
        let(:account) { create(:account) }
        let(:cancel_data) { {} }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '422', 'Missing Stripe subscription ID' do
        let(:cancel_data) { {} }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end
    end
  end

  path '/api/v1/subscription/portal_session' do
    post 'Create Stripe portal session' do
      tags 'Subscription'
      security [bearer_auth: []]
      produces 'application/json'
      description 'Create a Stripe billing portal session for subscription management'

      response '200', 'Portal session created' do
        schema type: :object, properties: {
          session_url: { type: :string, format: :uri }
        }

        it 'returns a 200 response' do |example|
          pending 'Requires Stripe mock'
          submit_request(example.metadata)
          assert_response_matches_metadata(example.metadata)
        end
      end

      response '401', 'Unauthorized' do
        let(:Authorization) { 'Bearer invalid' }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '402', 'No active subscription' do
        let(:account) { create(:account) }
        schema '$ref' => '#/components/schemas/error'

        run_test!
      end

      response '422', 'Missing customer ID' do
        schema '$ref' => '#/components/schemas/error'

        run_test!
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

      parameter name: :checkout_data, in: :body, schema: {
        type: :object,
        properties: {
          lookup_key: { type: :string, description: 'Stripe price lookup key' }
        },
        required: %w[lookup_key]
      }

      response '200', 'Checkout session created' do
        schema type: :object, properties: {
          message: { type: :string },
          url: { type: :string },
          test: { type: :object }
        }

        let(:checkout_data) { { lookup_key: 'dev_victus_journal_monthly' } }

        it 'returns a 200 response' do |example|
          pending 'Requires Stripe mock'
          submit_request(example.metadata)
          assert_response_matches_metadata(example.metadata)
        end
      end

      response '422', 'Missing lookup key' do
        schema '$ref' => '#/components/schemas/error'

        let(:checkout_data) { {} }

        run_test!
      end
    end
  end
end
