# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Stripe Webhook API', type: :request do
  path '/api/v1/stripe/webhook' do
    post 'Handle Stripe webhook events' do
      tags 'Webhooks'
      consumes 'application/json'
      produces 'application/json'
      description <<~DESC
        Webhook endpoint for Stripe events. Requires valid Stripe signature.

        Handled events:
        - customer.subscription.created
        - customer.subscription.updated
        - customer.subscription.deleted
        - invoice.paid
        - invoice.payment_failed
      DESC

      parameter name: 'Stripe-Signature', in: :header, type: :string, required: true,
                description: 'Stripe webhook signature for verification'

      response '200', 'Event processed' do
        schema type: :object, properties: {
          received: { type: :boolean }
        }

        run_test! do
          pending 'Requires valid Stripe signature'
        end
      end

      response '400', 'Invalid signature' do
        schema '$ref' => '#/components/schemas/error'

        run_test! do
          pending 'Requires Stripe event payload'
        end
      end
    end
  end
end
