class Subscription
  include Mongoid::Document
  include Mongoid::Timestamps


  belongs_to :account

  # 'active', 'cancelled', 'freezed', 'pending'
  field :status, type: String 
  # 'active', 'success', 'payment_failed', 'trial', 'pending_cancellation', 'pending_payment_information'
  field :sub_status, type: String

  def active?    = status == 'active'
  def trialing?  = sub_status == 'trial'
  def cancelled? = status == 'cancelled'
  def success? = sub_status == 'success'
  def pending_cancellation? = sub_status == 'pending_cancellation'

  # 'stripe'
  field :service_type, type: String
  field :service_details, type: Hash

  field :cancel_date, type: DateTime
  field :cancel_reason, type: String
  field :cancel_reason_details, type: Hash

  def cancel!(immediate:, reason: 'User requested cancellation')
    subscription_id = service_details&.dig('subscription_id')
    raise 'No active Stripe subscription' if subscription_id.blank?

    stripe_subscription = StripeService.new.cancel_subscription(
      subscription_id,
      cancel_at_period_end: !immediate
    )

    if immediate
      self.status = 'cancelled'
      self.cancel_date = Time.current
    else
      self.sub_status = 'pending_cancellation'
    end

    self.cancel_reason = reason.presence || 'User requested cancellation'
    save!

    stripe_subscription
  end

  def portal_session_url(return_url:)
    customer_id = service_details&.dig('customer_id')
    raise 'No customer ID found' if customer_id.blank?

    session = StripeService.new.create_subscription_session({
      customer: customer_id.to_s,
      return_url: return_url
    })

    session.url
  end
end
