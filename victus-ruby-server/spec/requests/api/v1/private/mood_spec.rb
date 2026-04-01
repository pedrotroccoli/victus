# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'Mood API', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:Authorization) { "Bearer #{auth_token_for(account)}" }

  path '/api/v1/mood' do
    get 'List all mood entries' do
      tags 'Mood'
      security [bearer_auth: []]
      produces 'application/json'

      parameter name: :start_date, in: :query, type: :string, format: :date, required: false
      parameter name: :end_date, in: :query, type: :string, format: :date, required: false

      response '200', 'Mood entries list' do
        schema type: :array, items: { '$ref' => '#/components/schemas/mood' }

        run_test!
      end
    end

    post 'Record mood' do
      tags 'Mood'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      description 'Record current mood. Can only be edited within a time window.'

      parameter name: :mood, in: :body, schema: {
        type: :object,
        properties: {
          score: { type: :integer, minimum: 1, maximum: 5, description: '1=Very Bad, 5=Very Good' },
          notes: { type: :string }
        },
        required: %w[score]
      }

      response '201', 'Mood recorded' do
        schema '$ref' => '#/components/schemas/mood'

        let(:mood) { { score: 4, notes: 'Feeling good' } }

        run_test!
      end

      response '422', 'Validation error' do
        schema '$ref' => '#/components/schemas/error'

        let(:mood) { { score: 10 } }

        run_test!
      end
    end
  end

  path '/api/v1/mood/{id}' do
    parameter name: :id, in: :path, type: :string, description: 'Mood entry ID'

    get 'Get a mood entry' do
      tags 'Mood'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Mood entry found' do
        schema '$ref' => '#/components/schemas/mood'

        let(:mood_record) { create(:mood, account: account) }
        let(:id) { mood_record.id.to_s }

        run_test!
      end
    end

    put 'Update a mood entry' do
      tags 'Mood'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      description 'Update mood. Only allowed within edit window.'

      parameter name: :mood, in: :body, schema: {
        type: :object,
        properties: {
          score: { type: :integer, minimum: 1, maximum: 5 },
          notes: { type: :string }
        }
      }

      response '200', 'Mood updated' do
        schema '$ref' => '#/components/schemas/mood'

        let(:mood_record) { create(:mood, account: account) }
        let(:id) { mood_record.id.to_s }
        let(:mood) { { score: 5 } }

        run_test!
      end

      response '403', 'Edit window expired' do
        schema '$ref' => '#/components/schemas/error'

        let(:mood_record) { create(:mood, account: account, created_at: 1.week.ago) }
        let(:id) { mood_record.id.to_s }
        let(:mood) { { score: 5 } }

        run_test!
      end
    end

    delete 'Delete a mood entry' do
      tags 'Mood'
      security [bearer_auth: []]

      response '204', 'Mood deleted' do
        let(:mood_record) { create(:mood, account: account) }
        let(:id) { mood_record.id.to_s }

        run_test!
      end
    end
  end
end
