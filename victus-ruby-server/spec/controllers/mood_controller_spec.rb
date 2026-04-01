require 'rails_helper'

RSpec.describe Private::MoodController, type: :controller do
  let(:account) { create(:account, :with_active_subscription) }
  let(:mood) { create(:mood, account: account) }

  before(:each) do
    allow(controller).to receive(:authorize_request).and_return(true)
    allow(controller).to receive(:check_subscription).and_return(true)
    controller.instance_variable_set(:@current_account, account)
  end

  describe 'GET #index' do
    let!(:mood1) { create(:mood, account: account, hour_block: 10, date: Date.today) }
    let!(:mood2) { create(:mood, account: account, hour_block: 11, date: Date.today) }
    let!(:other_account_mood) { create(:mood, hour_block: 10, date: Date.today) }

    it 'returns only moods from current account' do
      get :index

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      mood_ids = json_response.map { |m| m['_id'] }

      expect(mood_ids).to include(mood1.id.to_s)
      expect(mood_ids).to include(mood2.id.to_s)
      expect(mood_ids).not_to include(other_account_mood.id.to_s)
    end

    it 'returns moods ordered by created_at desc' do
      get :index

      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(2)
    end
  end

  describe 'GET #show' do
    before do
      allow(controller).to receive(:set_mood).and_return(true)
      controller.instance_variable_set(:@mood, mood)
    end

    it 'returns the mood' do
      get :show, params: { id: mood.id }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['_id']).to eq(mood.id.to_s)
      expect(json_response['value']).to eq(mood.value)
      expect(json_response['description']).to eq(mood.description)
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        value: 'good',
        description: 'Feeling good today'
      }
    end

    context 'with valid params' do
      it 'creates a new mood' do
        expect {
          post :create, params: { mood: valid_params }
        }.to change { Mood.count }.by(1)

        expect(response).to have_http_status(:created)
      end

      it 'returns the created mood' do
        post :create, params: { mood: valid_params }

        json_response = JSON.parse(response.body)
        expect(json_response['value']).to eq('good')
        expect(json_response['description']).to eq('Feeling good today')
        expect(json_response['hour_block']).to be_present
        expect(json_response['date']).to be_present
      end

      it 'associates mood with current account' do
        post :create, params: { mood: valid_params }

        created_mood = Mood.last
        expect(created_mood.account).to eq(account)
      end
    end

    context 'with invalid value' do
      it 'returns unprocessable_entity' do
        post :create, params: { mood: { value: 'invalid', description: 'Test' } }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to be_present
      end
    end

    context 'when mood already exists for this hour block' do
      before do
        create(:mood, account: account, hour_block: Time.current.hour, date: Date.today)
      end

      it 'returns unprocessable_entity' do
        post :create, params: { mood: valid_params }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Hour block já existe um mood registrado neste bloco de hora")
      end
    end

    context 'with missing required fields' do
      it 'returns error when value is missing' do
        post :create, params: { mood: { description: 'Test' } }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Value can't be blank")
      end
    end

    context 'with optional description' do
      it 'creates mood without description' do
        post :create, params: { mood: { value: 'good' } }

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['value']).to eq('good')
        expect(json_response['description']).to be_nil
      end
    end
  end

  describe 'PUT #update' do
    let(:current_hour_mood) { create(:mood, account: account, hour_block: Time.current.hour, date: Date.today) }

    before do
      allow(controller).to receive(:set_mood).and_return(true)
      controller.instance_variable_set(:@mood, current_hour_mood)
    end

    context 'with valid params within time window' do
      it 'updates the mood' do
        put :update, params: { id: current_hour_mood.id, mood: { value: 'amazing', description: 'Updated!' } }

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['value']).to eq('amazing')
        expect(json_response['description']).to eq('Updated!')
      end
    end

    context 'with invalid params' do
      it 'returns unprocessable_entity for invalid value' do
        put :update, params: { id: current_hour_mood.id, mood: { value: 'invalid' } }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to be_present
      end
    end

    context 'outside time window' do
      let(:old_mood) { create(:mood, account: account, hour_block: (Time.current.hour - 1) % 24, date: Date.today) }

      before do
        controller.instance_variable_set(:@mood, old_mood)
      end

      it 'returns unprocessable_entity' do
        put :update, params: { id: old_mood.id, mood: { value: 'amazing' } }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("só é possível editar o mood no mesmo dia e hora em que foi criado")
      end
    end
  end

  describe 'DELETE #destroy' do
    before do
      allow(controller).to receive(:set_mood).and_return(true)
      controller.instance_variable_set(:@mood, mood)
    end

    it 'deletes the mood' do
      delete :destroy, params: { id: mood.id }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq('Humor deletado com sucesso')
    end

    it 'soft deletes the mood' do
      mood_id = mood.id

      delete :destroy, params: { id: mood.id }

      expect(Mood.where(id: mood_id).count).to eq(0)
      expect(Mood.unscoped.where(id: mood_id).count).to eq(1)
    end

    context 'when deletion fails' do
      before do
        allow(mood).to receive(:destroy).and_raise(StandardError.new('Deletion failed'))
      end

      it 'returns unprocessable_entity' do
        delete :destroy, params: { id: mood.id }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to eq('Deletion failed')
      end
    end
  end
end
