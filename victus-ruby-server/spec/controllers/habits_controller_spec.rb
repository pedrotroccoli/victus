require 'rails_helper'

RSpec.describe Private::HabitsController, type: :controller do
  let(:account) { create(:account, :with_active_subscription) }
  let(:habit) { create(:habit, account: account) }

  before(:each) do
    # Stub authentication - bypassa o before_action :authorize_request
    allow(controller).to receive(:authorize_request).and_return(true)
    allow(controller).to receive(:check_subscription).and_return(true)
    controller.instance_variable_set(:@current_account, account)
  end

  describe 'POST #create' do
    let(:habit_params) do
      {
        name: 'Test Habit',
        description: 'Test Description',
        start_date: Date.today,
        recurrence_type: 'daily'
      }
    end

    context 'when operation succeeds' do
      let(:operation_result) { double('operation', success?: true, :[] => habit, errors: double(full_messages: [])) }

      before do
        allow(Habits::Create).to receive(:call).and_return(operation_result)
      end

      it 'calls the Create operation with correct params' do
        expect(Habits::Create).to receive(:call) do |args|
          expect(args[:params][:name]).to eq('Test Habit')
          expect(args[:params][:description]).to eq('Test Description')
          expect(args[:params][:recurrence_type]).to eq('daily')
          expect(args[:account]).to eq(account)
        end.and_return(operation_result)

        post :create, params: { habit: habit_params }
      end

      it 'returns created status' do
        post :create, params: { habit: habit_params }

        expect(response).to have_http_status(:created)
      end

      it 'renders the habit as JSON with habit_category included' do
        post :create, params: { habit: habit_params }

        json_response = JSON.parse(response.body)

        expect(json_response).to have_key('_id')
        expect(json_response).to have_key('name')
      end
    end

    context 'when operation fails' do
      let(:errors) { ['Name is required'] }
      let(:operation_result) do
        double('operation', success?: false, errors: errors).tap do |op|
          allow(op).to receive(:[]).with(:errors).and_return(errors)
        end
      end

      before do
        allow(Habits::Create).to receive(:call).and_return(operation_result)
      end

      it 'returns unprocessable_entity status' do
        post :create, params: { habit: habit_params }

        expect(response).to have_http_status(422)
      end

      it 'renders errors as JSON' do
        post :create, params: { habit: habit_params }

        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('errors')
        expect(json_response['errors']).to eq(['Name is required'])
      end
    end
  end

  describe 'GET #show' do
    before do
      allow(controller).to receive(:set_habit).and_return(true)
      controller.instance_variable_set(:@habit, habit)
    end

    it 'renders the habit as JSON' do
      get :show, params: { id: habit.id }

      expect(response).to have_http_status(:ok)

      json_response = JSON.parse(response.body)
      expect(json_response['_id']).to eq(habit.id.to_s)
      expect(json_response['name']).to eq(habit.name)
    end
  end

  describe 'GET #index' do
    let!(:habit1) { create(:habit, account: account, start_date: Date.today) }
    let!(:habit2) { create(:habit, account: account, start_date: Date.today + 3.days) }
    let!(:other_account_habit) { create(:habit) }

    it 'returns only habits from current account' do
      get :index

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      habit_ids = json_response.map { |h| h['_id'] }
      
      expect(habit_ids).to include(habit1.id.to_s)
      expect(habit_ids).to include(habit2.id.to_s)
      expect(habit_ids).not_to include(other_account_habit.id.to_s)
    end

    it 'filters habits by date range' do
      get :index, params: { start_date: Date.today - 5.days, end_date: Date.today }

      json_response = JSON.parse(response.body)
      habit_ids = json_response.map { |h| h['_id'] }
      
      expect(habit_ids).to include(habit1.id.to_s)
      expect(habit_ids).not_to include(habit2.id.to_s)
    end
  end

  describe 'PUT #update' do
    before do
      allow(controller).to receive(:set_habit).and_return(true)
      controller.instance_variable_set(:@habit, habit)
    end

    context 'when update succeeds' do
      it 'updates the habit' do
        put :update, params: { id: habit.id, habit: { name: 'Updated Name' } }

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq('Updated Name')
      end

      it 'handles paused flag' do
        put :update, params: { id: habit.id, habit: { paused: true } }

        expect(response).to have_http_status(:ok)
        habit.reload
        expect(habit.paused_at).not_to be_nil
      end

      it 'handles finished flag' do
        put :update, params: { id: habit.id, habit: { finished: true } }

        expect(response).to have_http_status(:ok)
        habit.reload
        expect(habit.finished_at).not_to be_nil
      end
    end

    context 'when update fails' do
      before do
        allow(habit).to receive(:update).and_return(false)
        allow(habit).to receive(:errors).and_return(double(full_messages: ['Name is invalid']))
      end

      it 'returns unprocessable_entity status' do
        put :update, params: { id: habit.id, habit: { name: '' } }

        expect(response).to have_http_status(422)
      end

      it 'renders errors as JSON' do
        put :update, params: { id: habit.id, habit: { name: '' } }

        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('errors')
      end
    end
  end

  describe 'DELETE #destroy' do
    before do
      allow(controller).to receive(:set_habit).and_return(true)
      controller.instance_variable_set(:@habit, habit)
    end

    it 'deletes the habit' do
      expect {
        delete :destroy, params: { id: habit.id }
      }.to change { Habit.count }.by(-1)

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq('Hábito deletado com sucesso')
    end

    context 'when deletion fails' do
      before do
        allow(habit).to receive(:destroy).and_raise(StandardError.new('Deletion failed'))
      end

      it 'returns unprocessable_entity status' do
        delete :destroy, params: { id: habit.id }

        expect(response).to have_http_status(422)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to eq('Deletion failed')
      end
    end
  end
end