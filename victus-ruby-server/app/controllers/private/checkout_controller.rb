module Private
class CheckoutController < Private::PrivateController
  skip_before_action :check_subscription

  def create
    lookup_key = params[:lookup_key]
    return render json: { error: 'Lookup key not found' }, status: :unprocessable_entity if lookup_key.blank?

    session = @current_account.create_stripe_checkout(lookup_key: lookup_key)
    render json: { message: 'Subscription created', url: session.url }
  rescue Account::CheckoutError => e
    render json: { error: e.message }, status: :unprocessable_entity
  rescue Stripe::CardError => e
    render json: { error: e.message }, status: :payment_required
  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
end
