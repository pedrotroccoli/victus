FactoryBot.define do
  factory :mood do
    account
    value { "good" }
    description { "Feeling good today" }
    hour_block { Time.current.hour }
    date { Date.today }

    trait :terrible do
      value { "terrible" }
      description { "Having a really bad day" }
    end

    trait :bad do
      value { "bad" }
      description { "Not feeling well" }
    end

    trait :neutral do
      value { "neutral" }
      description { "Just okay" }
    end

    trait :good do
      value { "good" }
      description { "Feeling good" }
    end

    trait :great do
      value { "great" }
      description { "Feeling great!" }
    end

    trait :amazing do
      value { "amazing" }
      description { "Best day ever!" }
    end
  end
end
