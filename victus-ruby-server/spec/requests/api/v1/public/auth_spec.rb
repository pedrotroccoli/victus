# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Public Auth API', type: :request do
  path '/api/v1/auth/sign-in' do
    post 'Sign in with email and password' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          account: {
            type: :object,
            properties: {
              email: { type: :string, format: :email },
              password: { type: :string }
            },
            required: %w[email password]
          }
        },
        required: %w[account]
      }

      response '200', 'Signed in successfully' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:account) { create(:account, password: 'password123') }
        let(:credentials) { { account: { email: account.email, password: 'password123' } } }

        run_test!
      end

      response '401', 'Invalid credentials' do
        schema '$ref' => '#/components/schemas/error'

        let(:credentials) { { account: { email: 'wrong@email.com', password: 'wrong' } } }

        run_test!
      end
    end
  end

  path '/api/v1/auth/sign-up' do
    post 'Create a new account' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :signup_data, in: :body, schema: {
        type: :object,
        properties: {
          account: {
            type: :object,
            properties: {
              email: { type: :string, format: :email },
              password: { type: :string, minLength: 6 },
              password_confirmation: { type: :string },
              name: { type: :string },
              phone: { type: :string }
            },
            required: %w[email password]
          },
          lookup_key: { type: :string, description: 'Stripe price lookup key for checkout' }
        },
        required: %w[account]
      }

      response '200', 'Account created with trial subscription' do
        schema type: :object, properties: {
          token: { type: :string },
          message: { type: :string },
          checkout_url: { type: :string, nullable: true }
        }

        let(:signup_data) { { account: { email: 'new@user.com', password: 'password123', password_confirmation: 'password123', name: 'Test User' } } }

        run_test!
      end

      response '401', 'Account already exists or invalid credentials' do
        schema '$ref' => '#/components/schemas/error'

        let(:existing_account) { create(:account) }
        let(:signup_data) { { account: { email: existing_account.email, password: 'password123', password_confirmation: 'password123' } } }

        run_test!
      end
    end
  end

  path '/api/v1/auth/start_siwe_auth' do
    get 'Start Sign-In with Ethereum flow' do
      tags 'Authentication'
      produces 'application/json'
      description 'Returns a nonce for SIWE signature verification'

      response '200', 'Nonce generated' do
        schema type: :object, properties: {
          nonce: { type: :string }
        }

        run_test!
      end
    end
  end

  path '/api/v1/auth/siwe_verify' do
    post 'Verify SIWE signature' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      description 'Verify Ethereum wallet signature and authenticate'

      parameter name: :siwe_data, in: :body, schema: {
        type: :object,
        properties: {
          payload: { type: :string, description: 'SIWE payload' },
          nonce: { type: :string, description: 'Nonce from start_siwe_auth' }
        },
        required: %w[payload nonce]
      }

      response '200', 'Authenticated successfully' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:siwe_data) { { payload: 'siwe_payload', nonce: 'test_nonce' } }

        it 'returns a 200 response' do |example|
          pending 'Requires valid SIWE message and AWS Lambda'
          submit_request(example.metadata)
          assert_response_matches_metadata(example.metadata)
        end
      end

      response '401', 'Invalid signature' do
        schema '$ref' => '#/components/schemas/error'

        let(:siwe_data) { { payload: '', nonce: '' } }

        run_test!
      end
    end
  end

  path '/api/v1/auth/google_auth' do
    post 'Authenticate with Google' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :google_data, in: :body, schema: {
        type: :object,
        properties: {
          id_token: { type: :string, description: 'Google ID token' }
        },
        required: %w[id_token]
      }

      response '200', 'Authenticated successfully' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:google_data) { { id_token: 'google_token' } }

        it 'returns a 200 response' do |example|
          pending 'Requires valid Google ID token'
          submit_request(example.metadata)
          assert_response_matches_metadata(example.metadata)
        end
      end

      response '401', 'Invalid token' do
        schema '$ref' => '#/components/schemas/error'

        let(:google_data) { { id_token: 'invalid' } }

        run_test!
      end
    end
  end
end
