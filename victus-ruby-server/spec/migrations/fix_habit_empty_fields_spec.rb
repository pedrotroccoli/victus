require 'rails_helper'
require_relative '../../db/migrate/20260402000001_fix_habit_empty_fields'

RSpec.describe FixHabitEmptyFields do
  let!(:account) { create(:account) }
  let!(:category) { create(:habit_category, account: account) }

  describe '.up' do
    it 'sets recurrence_type to infinite when no end_date' do
      habit = create(:habit, account: account, habit_category: category)
      habit.set(recurrence_type: nil, recurrence_details: nil, order: nil)

      described_class.up

      habit.reload
      expect(habit.recurrence_type).to eq('infinite')
      expect(habit.recurrence_details['rule']).to start_with('FREQ=DAILY;INTERVAL=1')
      expect(habit.order).not_to be_nil
    end

    it 'sets recurrence_type to daily when end_date is present' do
      habit = create(:habit, account: account, habit_category: category, end_date: 1.month.from_now)
      habit.set(recurrence_type: nil, recurrence_details: nil)

      described_class.up

      habit.reload
      expect(habit.recurrence_type).to eq('daily')
      expect(habit.recurrence_details['rule']).to include('UNTIL=')
    end

    it 'assigns sequential order values within a category' do
      habit1 = create(:habit, account: account, habit_category: category, created_at: 2.days.ago)
      habit2 = create(:habit, account: account, habit_category: category, name: 'Second Habit', created_at: 1.day.ago)
      habit1.set(order: nil)
      habit2.set(order: nil)

      described_class.up

      habit1.reload
      habit2.reload
      # ordered by created_at desc, so newer habit gets lower order value
      expect(habit2.order).to be < habit1.order
    end

    it 'does not overwrite existing recurrence_type' do
      habit = create(:habit, account: account, recurrence_type: 'weekly')

      described_class.up

      habit.reload
      expect(habit.recurrence_type).to eq('weekly')
    end
  end

  describe '.down' do
    it 'raises IrreversibleMigration' do
      expect { described_class.down }.to raise_error(Mongoid::IrreversibleMigration)
    end
  end
end
