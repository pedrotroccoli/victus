FactoryBot.define do
  factory :habit_check, class: 'HabitCheck' do
    association :habit, factory: :habit
    association :account, factory: :account
    checked { false }
    finished_at { nil }

    trait :checked do
      checked { true }
      finished_at { Time.current }
    end

    trait :unchecked do
      checked { false }
      finished_at { nil }
    end
  end
end

