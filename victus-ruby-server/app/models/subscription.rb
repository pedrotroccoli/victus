class Subscription
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia

  belongs_to :account

  # 'active', 'cancelled', 'freezed'
  field :status, type: String 
  # 'success', 'payment_failed', 'trial'
  field :sub_status, type: String

  # 'stripe'
  field :service_type, type: String
  field :service_details, type: Hash

  field :cancel_date, type: DateTime
  field :cancel_reason, type: String
  field :cancel_reason_details, type: Hash
end
