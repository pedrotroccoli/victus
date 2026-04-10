# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Private Rate Limiting', type: :request do
  let(:account) { create(:account, :with_active_subscription) }
  let(:headers) { { 'Authorization' => "Bearer #{auth_token_for(account)}" } }

  describe 'GET /api/v1/habits' do
    it 'returns 429 after exceeding per-user rate limit' do
      61.times do
        get '/api/v1/habits', headers: headers
      end

      expect(response).to have_http_status(:too_many_requests)
      expect(JSON.parse(response.body)['error']).to include('Rate limit')
      expect(response.headers['Retry-After']).to eq('60')
    end
  end
end
