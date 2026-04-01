require 'rails_helper'

RSpec.describe Mood, type: :model do
  include ActiveSupport::Testing::TimeHelpers

  let(:account) { create(:account) }

  describe 'validations' do
    describe 'value' do
      it 'is required' do
        mood = build(:mood, account: account, value: nil)
        expect(mood).not_to be_valid
        expect(mood.errors[:value]).to include("can't be blank")
      end

      it 'must be one of the allowed values' do
        Mood::VALUES.each do |valid_value|
          mood = build(:mood, account: account, value: valid_value)
          expect(mood).to be_valid
        end
      end

      it 'rejects invalid values' do
        mood = build(:mood, account: account, value: 'happy')
        expect(mood).not_to be_valid
        expect(mood.errors[:value]).to include("deve ser um dos valores: #{Mood::VALUES.join(', ')}")
      end
    end

    describe 'description' do
      it 'is optional' do
        mood = build(:mood, account: account, description: nil)
        expect(mood).to be_valid
      end
    end

    describe 'hour_block' do
      it 'must be between 0 and 23' do
        mood = build(:mood, account: account, hour_block: 24)
        expect(mood).not_to be_valid
        expect(mood.errors[:hour_block]).to be_present

        mood = build(:mood, account: account, hour_block: -1)
        expect(mood).not_to be_valid
        expect(mood.errors[:hour_block]).to be_present
      end

      it 'accepts valid hour blocks' do
        (0..23).each do |hour|
          mood = build(:mood, account: account, hour_block: hour, date: Date.today + hour.days)
          expect(mood).to be_valid, "Expected hour_block #{hour} to be valid"
        end
      end
    end

    describe 'uniqueness per hour block' do
      it 'allows only one mood per account per date per hour_block' do
        create(:mood, account: account, hour_block: 14, date: Date.today)

        duplicate = build(:mood, account: account, hour_block: 14, date: Date.today)
        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:hour_block]).to include("já existe um mood registrado neste bloco de hora")
      end

      it 'allows same hour_block on different dates' do
        create(:mood, account: account, hour_block: 14, date: Date.today)

        different_date = build(:mood, account: account, hour_block: 14, date: Date.tomorrow)
        expect(different_date).to be_valid
      end

      it 'allows same hour_block for different accounts' do
        other_account = create(:account, email: 'other@example.com')
        create(:mood, account: account, hour_block: 14, date: Date.today)

        other_account_mood = build(:mood, account: other_account, hour_block: 14, date: Date.today)
        expect(other_account_mood).to be_valid
      end

      it 'allows different hour_blocks on same date' do
        create(:mood, account: account, hour_block: 14, date: Date.today)

        different_hour = build(:mood, account: account, hour_block: 15, date: Date.today)
        expect(different_hour).to be_valid
      end
    end
  end

  describe 'before_validation callback' do
    it 'sets hour_block from current time on create' do
      travel_to Time.zone.local(2026, 1, 10, 15, 30, 0) do
        mood = create(:mood, account: account, hour_block: nil, date: nil)
        expect(mood.hour_block).to eq(15)
      end
    end

    it 'sets date from current time on create' do
      travel_to Time.zone.local(2026, 1, 10, 15, 30, 0) do
        mood = create(:mood, account: account, hour_block: nil, date: nil)
        expect(mood.date).to eq(Date.new(2026, 1, 10))
      end
    end

    it 'does not override hour_block if already set' do
      mood = create(:mood, account: account, hour_block: 10, date: Date.today)
      expect(mood.hour_block).to eq(10)
    end

    it 'does not override date if already set' do
      specific_date = Date.new(2026, 6, 15)
      mood = create(:mood, account: account, date: specific_date, hour_block: 12)
      expect(mood.date).to eq(specific_date)
    end
  end

  describe '#within_edit_window?' do
    it 'returns true within same day and hour' do
      travel_to Time.zone.local(2026, 1, 10, 14, 30, 0) do
        mood = create(:mood, account: account)
        expect(mood.within_edit_window?).to be true
      end
    end

    it 'returns false when hour has changed' do
      mood = nil
      travel_to Time.zone.local(2026, 1, 10, 14, 30, 0) do
        mood = create(:mood, account: account)
      end

      travel_to Time.zone.local(2026, 1, 10, 15, 30, 0) do
        expect(mood.within_edit_window?).to be false
      end
    end

    it 'returns false when day has changed' do
      mood = nil
      travel_to Time.zone.local(2026, 1, 10, 14, 30, 0) do
        mood = create(:mood, account: account)
      end

      travel_to Time.zone.local(2026, 1, 11, 14, 30, 0) do
        expect(mood.within_edit_window?).to be false
      end
    end
  end

  describe 'associations' do
    it 'belongs to an account' do
      mood = create(:mood, account: account)
      expect(mood.account).to eq(account)
    end
  end

  describe 'constants' do
    it 'defines valid mood values' do
      expect(Mood::VALUES).to eq(%w[terrible bad neutral good great amazing])
    end
  end

  describe 'soft delete (Paranoia)' do
    it 'soft deletes instead of hard delete' do
      mood = create(:mood, account: account)
      mood_id = mood.id

      mood.destroy

      expect(Mood.where(id: mood_id).count).to eq(0)
      expect(Mood.unscoped.where(id: mood_id).count).to eq(1)
    end
  end
end
