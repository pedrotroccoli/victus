account = Account.find_by(email: 'dev@victusjournal.com')

if account
  category = HabitCategory.find_by(name: 'Health', account: account)

  Habit.find_or_create_by!(name: 'Morning Exercise', account: account) do |h|
    h.description = 'Daily workout routine'
    h.start_date = Time.current
    h.recurrence_type = 'infinite'
    h.recurrence_details = { rule: 'FREQ=DAILY;INTERVAL=1' }
    h.order = 1000.0
    h.habit_category = category
  end

  Habit.find_or_create_by!(name: 'Read 30 minutes', account: account) do |h|
    h.description = 'Read a book for at least 30 minutes'
    h.start_date = Time.current
    h.recurrence_type = 'infinite'
    h.recurrence_details = { rule: 'FREQ=DAILY;INTERVAL=1' }
    h.order = 2000.0
    h.habit_category = HabitCategory.find_by(name: 'Productivity', account: account)
  end

  puts "  Seeded habits"
end
