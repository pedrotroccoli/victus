FactoryBot.define do
  factory :account do
    name { "Test User" }
    sequence(:email) { |n| "test#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    phone { nil }
    world_address { nil }
    connected_providers { ['web'] }

    trait :with_subscription do
      after(:create) do |account|
        create(:subscription, account: account)
      end
    end

    trait :with_active_subscription do
      after(:create) do |account|
        create(:subscription, :active, account: account)
      end
    end
  end
end