module Private
class CheckoutController < Private::PrivateController
  skip_before_action :check_subscription

  def create
    lookup_key = params[:lookup_key]

    render json: { error: 'Lookup key not found' }, status: :unprocessable_entity if lookup_key.blank?

    price = Stripe::Price.list(
      lookup_keys: [lookup_key],
      expand: ['data.product']
    )

    if price.data.empty?
      return render json: { error: 'Invalid lookup key' }, status: :unprocessable_entity
    end

    product = price.data.first.product

    if product.active == false
      return render json: { error: 'Product is not active' }, status: :unprocessable_entity
    end

    if @current_account.subscription.present? && @current_account.subscription.status == 'active'
      return render json: { error: 'Account already has an active subscription' }, status: :unprocessable_entity
    end

    # if @current_account.subscription.present? && @current_account.subscription.status == 'pending'
    #   customer_id = @current_account.subscription.service_details['customer_id']

    #   sessions = Stripe::Checkout::Session.list({
    #     customer: customer_id,
    #     limit: 1,
    #     status: 'open'
    #   })

    #   checkout_session = sessions.data.first

    #   if checkout_session.present? && checkout_session.status == 'open' && checkout_session.allow_promotion_codes == true
    #     metadata = checkout_session.metadata.to_h

    #     if metadata[:lookup_key].to_s == lookup_key.to_s
    #       return render json: { message: 'Existing checkout session found', url: checkout_session.url }
    #     end
    #   end
    # end

    if @current_account.subscription.nil?
      customer = Stripe::Customer.create(
        email: @current_account.email,
        name: @current_account.name,
        metadata: {
          account_id: @current_account.id,
        }
      )

      subscription = Subscription.new(
        status: 'pending',
        service_type: 'stripe',
        service_details: {
          customer_id: customer.id
        }
      )

      @current_account.subscription = subscription

      customer_id = customer.id
    else 
      customer_id = @current_account.subscription.service_details['customer_id']
    end

    if @current_account.subscription.present? && @current_account.subscription.status == 'success'
      return render json: { error: 'Account already has a subscription' }, status: :unprocessable_entity
    end

    session = Stripe::Checkout::Session.create({
      customer: customer_id,
      mode: 'subscription',
      line_items: [{ price: price.data.first.id, quantity: 1 }],
      success_url: "#{ENV['APP_URL']}/?checkout_success=true",
      cancel_url: "#{ENV['APP_URL']}/?checkout_cancel=true",
      metadata: {
        account_id: @current_account.id,
        lookup_key: lookup_key
      },
      allow_promotion_codes: true
    })

    render json: { message: 'Subscription created', url: session.url, test: session }
  rescue Stripe::CardError => e
    render json: { error: e.message }, status: :payment_required
  end
end
end