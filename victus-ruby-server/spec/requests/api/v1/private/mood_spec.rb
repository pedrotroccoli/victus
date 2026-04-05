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
      description 'Record current mood. Can only be edited within the same hour block.'

      parameter name: :mood_data, in: :body, schema: {
        type: :object,
        required: %w[mood],
        properties: {
          mood: {
            type: :object,
            properties: {
              value: { type: :string, enum: %w[terrible bad neutral good great amazing], description: 'Mood value' },
              description: { type: :string }
            },
            required: %w[value]
          }
        }
      }

      response '201', 'Mood recorded' do
        schema '$ref' => '#/components/schemas/mood'

        let(:mood_data) { { mood: { value: 'good', description: 'Feeling good' } } }

        run_test!
      end

      response '422', 'Validation error' do
        schema type: :object, properties: {
          errors: { type: :array, items: { type: :string } }
        }

        let(:mood_data) { { mood: { value: 'invalid_value' } } }

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

      response '404', 'Mood not found' do
        schema '$ref' => '#/components/schemas/error'

        let(:id) { BSON::ObjectId.new.to_s }

        run_test!
      end
    end

    put 'Update a mood entry' do
      tags 'Mood'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      description 'Update mood. Only allowed within edit window (same hour block and date).'

      parameter name: :mood_data, in: :body, schema: {
        type: :object,
        required: %w[mood],
        properties: {
          mood: {
            type: :object,
            properties: {
              value: { type: :string, enum: %w[terrible bad neutral good great amazing] },
              description: { type: :string }
            }
          }
        }
      }

      response '200', 'Mood updated' do
        schema '$ref' => '#/components/schemas/mood'

        let(:mood_record) { create(:mood, account: account) }
        let(:id) { mood_record.id.to_s }
        let(:mood_data) { { mood: { value: 'great' } } }

        run_test!
      end

      response '422', 'Edit window expired' do
        schema type: :object, properties: {
          errors: { type: :array, items: { type: :string } }
        }

        let(:mood_record) { create(:mood, account: account, hour_block: (Time.current.hour - 1) % 24, date: Date.yesterday) }
        let(:id) { mood_record.id.to_s }
        let(:mood_data) { { mood: { value: 'great' } } }

        run_test!
      end
    end

    delete 'Delete a mood entry' do
      tags 'Mood'
      security [bearer_auth: []]

      response '200', 'Mood deleted' do
        schema type: :object, properties: {
          message: { type: :string }
        }

        let(:mood_record) { create(:mood, account: account) }
        let(:id) { mood_record.id.to_s }

        run_test!
      end
    end
  end
end
