FactoryBot.define do
  factory :habit_category do
    account
    name { "Health" }
    order { 0.0 }
  end
end


