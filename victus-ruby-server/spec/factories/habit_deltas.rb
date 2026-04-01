FactoryBot.define do
  factory :habit_delta do
    association :habit
    type { "number" }
    name { "Duration" }
    description { "Exercise duration in minutes" }
    enabled { true }
    version { "v2" }

    trait :string_type do
      type { "string" }
      name { "Notes" }
      description { "Additional notes" }
    end

    trait :time_type do
      type { "time" }
      name { "Start Time" }
      description { "When to start" }
    end

    trait :disabled do
      enabled { false }
    end
  end
end


