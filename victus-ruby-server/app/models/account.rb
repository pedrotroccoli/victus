class Account
  include Mongoid::Document
  include ActiveModel::SecurePassword
  include Mongoid::Timestamps

  has_many :habits, class_name: 'Habit'
  has_many :habit_checks
  has_many :habit_categories
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

  # ── Authentication ──────────────────────────────────────────────

  def self.authenticate_with_email(email, password)
    account = find_by(email: email)
    return nil unless account&.authenticate(password)

    account
  end

  def self.find_or_create_from_google(google_id:, email:, name:)
    return nil if google_id.blank?

    account = find_by(google_id: google_id)

    if account.nil? && email.present?
      account = find_by(email: email)
      account&.update!(google_id: google_id)
    end

    is_new = account.nil?

    if is_new
      account = new(google_id: google_id, email: email, name: name)
      account.create_trial_subscription
    end

    account.ensure_provider('google')
    account.save!
    account.subscription&.save! if is_new

    account
  end

  def self.find_or_create_from_siwe(address)
    return nil if address.blank?

    account = find_or_initialize_by(world_address: address)
    is_new = account.new_record?

    account.ensure_provider('worldapp')

    if account.subscription.nil?
      account.subscription = Subscription.new(
        status: 'active',
        sub_status: 'active',
        service_type: 'worldapp',
        service_details: {}
      )
    end

    account.save!
    account.subscription.save! if is_new || account.subscription.new_record?

    account
  end

  # ── Instance Methods ────────────────────────────────────────────

  def generate_jwt
    payload = {
      account_id: id,
      iat: Time.current.to_i,
      exp: 24.hours.from_now.to_i
    }

    JWT.encode(payload, ENV.fetch('JWT_SECRET') { raise KeyError, 'Missing JWT_SECRET' unless Rails.env.test?; 'test_jwt_secret' }, 'HS256')
  end

  def subscription_active?
    subscription&.status == 'active'
  end

  def ensure_provider(provider)
    return if connected_providers.include?(provider)

    connected_providers << provider
  end

  def create_trial_subscription
    self.subscription = Subscription.new(
      status: 'pending',
      sub_status: 'pending_payment_information',
      service_details: { trial_ends_at: 14.days.from_now }
    )
  end
end
