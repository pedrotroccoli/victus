require 'rails_helper'
require_relative '../../db/migrate/20260402000002_fix_habit_end_date'

RSpec.describe FixHabitEndDate do
  let!(:account) { create(:account) }

  describe '.up' do
    it 'clears end_date on infinite habits' do
      habit = create(:habit, :infinite, account: account)
      habit.set(end_date: 1.month.from_now)

      described_class.up

      habit.reload
      expect(habit.end_date).to be_nil
    end

    it 'does not touch non-infinite habits' do
      end_date = 1.month.from_now
      habit = create(:habit, account: account, recurrence_type: 'daily', end_date: end_date)

      described_class.up

      habit.reload
      expect(habit.end_date).to be_within(1.second).of(end_date)
    end

    it 'handles habits without end_date' do
      habit = create(:habit, :infinite, account: account, end_date: nil)

      expect { described_class.up }.not_to raise_error

      habit.reload
      expect(habit.end_date).to be_nil
    end
  end

  describe '.down' do
    it 'raises IrreversibleMigration' do
      expect { described_class.down }.to raise_error(Mongoid::IrreversibleMigration)
    end
  end
end
