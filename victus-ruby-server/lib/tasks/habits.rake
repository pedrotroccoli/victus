namespace :habits do
  desc "TODO"
  task fix_empty_fields: :environment do
    accounts = Account.all
    accounts.each do |account|
      all_habits = account.habits.order(created_at: :desc).includes(:habit_category).group_by { |habit| habit.habit_category&.name || 'Uncategorized' }

       next if all_habits.empty?

       puts "\n ------------------------------------------------------------"

       all_habits.each do |category, habits|
         start = 1000.0

         habits.each do |habit|
           if habit.recurrence_type.blank?
             habit.recurrence_type = habit&.end_date ? 'daily' : 'infinite'
           end

           if habit.recurrence_details.blank? || habit.recurrence_details[:rrule].blank?
             rule = "FREQ=DAILY;INTERVAL=1#{habit.end_date ? ";UNTIL=#{Time.parse(habit.end_date).strftime('%Y%m%dT%H%M%SZ')}" : ""}"

             habit.recurrence_details = {
               rule: rule
             }
           end

           habit.order = start

           habit.save!

           start += 1000.0
         end
       end

      puts "\n ------------------------------------------------------------"
    end
  end

  task fix_end_date: :environment do
    accounts = Account.all
    accounts.each do |account|
      all_habits = account.habits.order(created_at: :desc).includes(:habit_category)

      all_habits.each do |habit|
        if habit.recurrence_type == 'infinite' && habit.end_date.present?
          habit.end_date = nil
          habit.save!
        end
      end
    end
  end
end
