class Account
  include Mongoid::Document
  include ActiveModel::SecurePassword
  include Mongoid::Timestamps

  has_many :habits, class_name: 'Habit'
  has_many :habit_checks
  has_many :moods
  has_one :subscription

  field :name, type: String
  field :email, type: String
  field :password_digest, type: String
  field :phone, type: String, default: nil
  field :world_address, type: String, default: nil
  field :google_id, type: String, default: nil
  field :connected_providers, type: Array, default: ['web']

  validates :world_address, uniqueness: true, allow_nil: true
  validates :google_id, uniqueness: true, allow_nil: true

  has_secure_password validations: false

  def create_trial_subscription
    self.subscription = Subscription.new(
      status: 'pending',
      sub_status: 'pending_payment_information',
      service_details: { trial_ends_at: 14.days.from_now }
    )
  end
end
