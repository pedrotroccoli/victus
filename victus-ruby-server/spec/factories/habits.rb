FactoryBot.define do
  factory :habit, class: 'Habit' do
    account
    name { "Morning Exercise" }
    description { "Daily workout routine" }
    start_date { Date.today + 1.day }
    recurrence_type { "daily" }
    recurrence_details { { rule: "FREQ=DAILY" } }
    order { 1.0 }
    delta_enabled { false }
    rule_engine_enabled { false }
    rule_engine_details { nil }
    finished_at { nil }
    paused_at { nil }
    last_check { nil }
    end_date { nil }
    parent_habit_id { nil }

    trait :with_category do
      habit_category
    end

    trait :with_deltas do
      after(:create) do |habit|
        create_list(:habit_delta, 2, habit: habit)
      end
    end

    trait :weekly do
      recurrence_type { "weekly" }
      recurrence_details { { rule: "FREQ=WEEKLY;BYDAY=MO" } }
    end

    trait :monthly do
      recurrence_type { "monthly" }
      recurrence_details { { rule: "FREQ=MONTHLY;BYMONTHDAY=1" } }
    end

    trait :yearly do
      recurrence_type { "yearly" }
      recurrence_details { { rule: "FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1" } }
    end

    trait :infinite do
      recurrence_type { "infinite" }
      recurrence_details { { rule: "FREQ=DAILY" } }
    end

    trait :paused do
      paused_at { Time.current }
    end

    trait :finished do
      finished_at { Time.current }
    end

    trait :with_end_date do
      end_date { Date.today + 30.days }
    end
  end
end


