class FixHabitEndDate < Mongoid::Migration
  def self.up
    Account.all.each do |account|
      account.habits.where(recurrence_type: 'infinite', :end_date.ne => nil).each do |habit|
        habit.end_date = nil
        habit.save!
      end
    end

    validate!
  end

  def self.down
    raise Mongoid::IrreversibleMigration
  end

  def self.validate!
    bad = Habit.where(recurrence_type: 'infinite', :end_date.ne => nil).count
    raise "Validation failed: #{bad} infinite habits still have end_date set" if bad > 0
  end
end
