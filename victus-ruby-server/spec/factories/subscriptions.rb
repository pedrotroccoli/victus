FactoryBot.define do
  factory :subscription do
    account
    status { "active" }
    sub_status { "active" }
    service_type { "stripe" }
    service_details { {} }
    cancel_date { nil }
    cancel_reason { nil }
    cancel_reason_details { nil }

    trait :active do
      status { "active" }
      sub_status { "active" }
    end

    trait :freezed do
      status { "freezed" }
      sub_status { "pending_payment_information" }
    end

    trait :cancelled do
      status { "cancelled" }
      cancel_date { Time.current }
    end
  end
end