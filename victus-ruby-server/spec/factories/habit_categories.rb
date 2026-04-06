FactoryBot.define do
  factory :habit_category do
    account
    sequence(:name) { |n| "Category #{n}" }
    order { 0.0 }
  end
end


