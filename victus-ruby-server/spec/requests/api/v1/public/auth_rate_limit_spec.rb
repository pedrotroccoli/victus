# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth Rate Limiting', type: :request do
  describe 'POST /api/v1/auth/sign-in' do
    it 'returns 429 after exceeding rate limit' do
      11.times do
        post '/api/v1/auth/sign-in',
             params: { account: { email: 'test@test.com', password: 'wrong' } },
             as: :json
      end

      expect(response).to have_http_status(:too_many_requests)
      expect(JSON.parse(response.body)['error']).to include('Rate limit')
      expect(response.headers['Retry-After']).to eq('60')
    end
  end

  describe 'POST /api/v1/auth/sign-up' do
    it 'returns 429 after exceeding sign-up rate limit' do
      6.times do |i|
        post '/api/v1/auth/sign-up',
             params: { account: { name: "User #{i}", email: "user#{i}@test.com", password: 'password123', password_confirmation: 'password123' } },
             as: :json
      end

      expect(response).to have_http_status(:too_many_requests)
      expect(JSON.parse(response.body)['error']).to include('Rate limit')
    end
  end
end
