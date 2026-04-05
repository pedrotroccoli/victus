class StripeService
  def create_customer(email:, name: nil, metadata: {})
    Stripe::Customer.create(
      email: email,
      name: name,
      metadata: metadata
    )
  end

  def create_checkout(customer_id:, account_id:, lookup_key:)
    price = Stripe::Price.list(lookup_keys: [lookup_key], expand: ['data.product'])

    Stripe::Checkout::Session.create(
      customer: customer_id,
      mode: 'subscription',
      line_items: [{ price: price.data.first.id, quantity: 1 }],
      success_url: "#{ENV['APP_URL']}/?checkout_success=true",
      cancel_url: "#{ENV['APP_URL']}/?checkout_cancel=true",
      metadata: { account_id: account_id, lookup_key: lookup_key },
      allow_promotion_codes: true
    )
  end

  def create_billing_portal_session(customer_id:, return_url:)
    Stripe::BillingPortal::Session.create(
      customer: customer_id,
      return_url: return_url
    )
  end

  def create_subscription_session(params)
    Stripe::BillingPortal::Session.create(
      customer: params[:customer],
      return_url: params[:return_url]
    )
  end

  def cancel_subscription(subscription_id, cancel_at_period_end: true)
    if cancel_at_period_end
      Stripe::Subscription.update(subscription_id, { cancel_at_period_end: true })
    else
      Stripe::Subscription.cancel(subscription_id)
    end
  end

  def get_subscription(subscription_id)
    Stripe::Subscription.retrieve(subscription_id)
  end

  def list_invoices(customer_id:, limit: 10)
    Stripe::Invoice.list(customer: customer_id, limit: limit)
  end
end
