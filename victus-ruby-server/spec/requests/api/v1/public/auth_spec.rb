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
          email: { type: :string, format: :email },
          password: { type: :string }
        },
        required: %w[email password]
      }

      response '200', 'Signed in successfully' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:account) { create(:account, password: 'password123') }
        let(:credentials) { { email: account.email, password: 'password123' } }

        run_test!
      end

      response '401', 'Invalid credentials' do
        schema '$ref' => '#/components/schemas/error'

        let(:credentials) { { email: 'wrong@email.com', password: 'wrong' } }

        run_test!
      end
    end
  end

  path '/api/v1/auth/sign-up' do
    post 'Create a new account' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :account_params, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, format: :email },
          password: { type: :string, minLength: 6 },
          name: { type: :string }
        },
        required: %w[email password]
      }

      response '201', 'Account created with trial subscription' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:account_params) { { email: 'new@user.com', password: 'password123', name: 'Test User' } }

        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object, properties: {
          errors: { type: :array, items: { type: :string } }
        }

        let(:account_params) { { email: 'invalid', password: '123' } }

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

      parameter name: :siwe_params, in: :body, schema: {
        type: :object,
        properties: {
          message: { type: :string, description: 'SIWE message' },
          signature: { type: :string, description: 'Ethereum signature' }
        },
        required: %w[message signature]
      }

      response '200', 'Authenticated successfully' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:siwe_params) { { message: 'siwe_message', signature: '0x...' } }

        run_test! do
          pending 'Requires valid SIWE message and signature'
        end
      end

      response '401', 'Invalid signature' do
        schema '$ref' => '#/components/schemas/error'

        let(:siwe_params) { { message: 'invalid', signature: 'invalid' } }

        run_test!
      end
    end
  end

  path '/api/v1/auth/google_auth' do
    post 'Authenticate with Google' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :google_params, in: :body, schema: {
        type: :object,
        properties: {
          id_token: { type: :string, description: 'Google ID token' }
        },
        required: %w[id_token]
      }

      response '200', 'Authenticated successfully' do
        schema '$ref' => '#/components/schemas/auth_response'

        let(:google_params) { { id_token: 'google_token' } }

        run_test! do
          pending 'Requires valid Google ID token'
        end
      end

      response '401', 'Invalid token' do
        schema '$ref' => '#/components/schemas/error'

        let(:google_params) { { id_token: 'invalid' } }

        run_test!
      end
    end
  end
end
