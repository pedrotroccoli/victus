class FixHabitEmptyFields < Mongoid::Migration
  def self.up
    Account.all.each do |account|
      grouped = account.habits.order(created_at: :desc)
        .includes(:habit_category)
        .group_by { |h| h.habit_category&.name || 'Uncategorized' }

      next if grouped.empty?

      grouped.each do |_category, habits|
        order_val = 1000.0

        habits.each do |habit|
          if habit.recurrence_type.blank?
            habit.recurrence_type = habit.end_date ? 'daily' : 'infinite'
          end

          if habit.recurrence_details.blank? || habit.recurrence_details[:rrule].blank?
            until_clause = habit.end_date ? ";UNTIL=#{habit.end_date.utc.strftime('%Y%m%dT%H%M%SZ')}" : ""
            habit.recurrence_details = { rule: "FREQ=DAILY;INTERVAL=1#{until_clause}" }
          end

          habit.order = order_val
          habit.save!
          order_val += 1000.0
        end
      end
    end

    validate!
  end

  def self.down
    raise Mongoid::IrreversibleMigration
  end

  def self.validate!
    bad_recurrence = Habit.where(recurrence_type: nil).count
    raise "Validation failed: #{bad_recurrence} habits still have nil recurrence_type" if bad_recurrence > 0

    bad_order = Habit.where(order: nil).count
    raise "Validation failed: #{bad_order} habits still have nil order" if bad_order > 0
  end
end
