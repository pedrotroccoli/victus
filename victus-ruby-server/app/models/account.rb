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

  def self.sign_up_with_email(attrs, lookup_key: nil)
    account = new(attrs.to_h)
    checkout_url = nil

    if lookup_key.present?
      return unless account.save

      customer = nil
      begin
        customer = Stripe::Customer.create(email: account.email)

        account.build_subscription(
          service_type: 'stripe',
          status: 'freezed',
          sub_status: 'pending_payment_information',
          service_details: { customer_id: customer.id }
        )
        account.subscription.save!

        price = Stripe::Price.list(lookup_keys: [lookup_key], expand: ['data.product'])
        selected_price = price.data.first

        unless selected_price && selected_price.active && selected_price.product&.active
          account.subscription&.destroy
          Stripe::Customer.delete(customer.id)
          account.destroy
          return nil
        end

        checkout_session = account.send(:build_checkout_session,
          customer_id: customer.id,
          account_id: account.id,
          lookup_key: lookup_key,
          price_id: selected_price.id
        )

        checkout_url = checkout_session.url
      rescue StandardError
        account.subscription&.destroy
        Stripe::Customer.delete(customer.id) if customer
        account.destroy
        raise
      end
    else
      account.create_trial_subscription
      return unless account.save

      account.subscription.save!
    end

    EmailJob.perform_later(account.id)
    { account: account, checkout_url: checkout_url }
  end

  def self.authenticate_with_google(id_token:)
    return nil if id_token.blank?

    validator = GoogleIDToken::Validator.new
    payload = validator.check(id_token, ENV['GOOGLE_CLIENT_ID'])
    return nil if payload.nil?

    find_or_create_from_google(
      google_id: payload['sub'],
      email: payload['email'],
      name: payload['name']
    )
  end

  def self.authenticate_with_siwe(payload:, nonce:)
    return nil if payload.blank? || nonce.blank?

    lambda_client = Aws::Lambda::Client.new(region: 'us-east-1')

    lambda_response = lambda_client.invoke(
      function_name: 'victus-siwe-dev-world-siwe-verify',
      invocation_type: 'RequestResponse',
      payload: { payload: payload, nonce: nonce }.to_json
    )

    return nil if lambda_response.status_code != 200

    response_body = JSON.parse(lambda_response.payload.read)
    return nil if response_body['valid'] == false

    find_or_create_from_siwe(response_body['data']['address'])
  rescue JSON::ParserError
    nil
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

  # ── Checkout ───────────────────────────────────────────────────

  class CheckoutError < StandardError; end
  class InvalidLookupKey < CheckoutError; end
  class InactiveProduct < CheckoutError; end
  class AlreadySubscribed < CheckoutError; end

  def create_stripe_checkout(lookup_key:)
    price = Stripe::Price.list(lookup_keys: [lookup_key], expand: ['data.product'])
    raise InvalidLookupKey, 'Invalid lookup key' if price.data.empty?
    raise InactiveProduct, 'Product is not active' unless price.data.first.product.active

    if subscription.present? && subscription.status == 'active'
      raise AlreadySubscribed, 'Account already has an active subscription'
    end

    if subscription.nil?
      customer = Stripe::Customer.create(
        email: email,
        name: name,
        metadata: { account_id: id }
      )

      self.subscription = Subscription.new(
        status: 'pending',
        service_type: 'stripe',
        service_details: { customer_id: customer.id }
      )

      customer_id = customer.id
    else
      customer_id = subscription.service_details['customer_id']
    end

    raise AlreadySubscribed, 'Account already has a subscription' if subscription.status == 'success'

    build_checkout_session(
      customer_id: customer_id,
      account_id: id,
      lookup_key: lookup_key,
      price_id: price.data.first.id
    )
  end

  # ── Instance Methods ────────────────────────────────────────────

  def generate_jwt
    payload = {
      account_id: id,
      iat: Time.current.to_i,
      exp: 24.hours.from_now.to_i
    }

    JWT.encode(payload, ENV.fetch('JWT_SECRET') { raise KeyError, 'Missing JWT_SECRET' unless Rails.env.test?; 'test_secret' }, 'HS256')
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

  private

  def build_checkout_session(customer_id:, account_id:, lookup_key:, price_id:)
    app_url = ENV.fetch('APP_URL')

    Stripe::Checkout::Session.create(
      customer: customer_id,
      mode: 'subscription',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: "#{app_url}/?checkout_success=true",
      cancel_url: "#{app_url}/?checkout_cancel=true",
      metadata: { account_id: account_id, lookup_key: lookup_key },
      allow_promotion_codes: true
    )
  end
end
