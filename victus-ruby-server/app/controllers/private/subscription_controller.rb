module Private
  class SubscriptionController < Private::PrivateController
    def show
      subscription = @current_account.subscription

      if subscription.nil?
        return render json: { error: 'No subscription found' }, status: :not_found
      end

      stripe_service = StripeService.new
      stripe_subscription = nil

      if subscription.service_details&.dig('subscription_id')
        stripe_subscription = stripe_service.get_subscription(
          subscription.service_details['subscription_id']
        )
      end

      render json: {
        status: subscription.status,
        sub_status: subscription.sub_status,
        service_type: subscription.service_type,
        cancel_date: subscription.cancel_date,
        cancel_reason: subscription.cancel_reason,
        current_period_end: stripe_subscription&.current_period_end,
        cancel_at_period_end: stripe_subscription&.cancel_at_period_end,
        trial_end: stripe_subscription&.trial_end
      }, status: :ok
    rescue Stripe::InvalidRequestError => e
      render json: {
        status: subscription.status,
        sub_status: subscription.sub_status,
        service_type: subscription.service_type,
        error: 'Could not fetch Stripe details'
      }, status: :ok
    end

    def cancel
      subscription = @current_account.subscription

      if subscription.nil?
        return render json: { error: 'No subscription found' }, status: :not_found
      end

      subscription_id = subscription.service_details&.dig('subscription_id')

      if subscription_id.nil?
        return render json: { error: 'No active Stripe subscription' }, status: :unprocessable_entity
      end

      cancel_immediately = params[:immediate] == true || params[:immediate] == 'true'
      stripe_service = StripeService.new

      stripe_subscription = stripe_service.cancel_subscription(
        subscription_id,
        cancel_at_period_end: !cancel_immediately
      )

      if cancel_immediately
        subscription.status = 'cancelled'
        subscription.cancel_date = Time.now
      else
        subscription.sub_status = 'pending_cancellation'
      end

      subscription.cancel_reason = params[:reason] || 'User requested cancellation'
      subscription.save!

      render json: {
        message: cancel_immediately ? 'Subscription cancelled' : 'Subscription will cancel at period end',
        cancel_at: stripe_subscription.cancel_at || stripe_subscription.current_period_end
      }, status: :ok
    rescue Stripe::InvalidRequestError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end

    def create_session
      subscription = @current_account.subscription

      if subscription.nil? || subscription.service_details&.dig('customer_id').nil?
        return render json: { error: 'No subscription found' }, status: :not_found
      end

      stripe_session = StripeService.new.create_subscription_session({
        customer: subscription.service_details['customer_id'].to_s,
        return_url: "#{ENV['APP_URL']}/account/subscription"
      })

      render json: { session_url: stripe_session.url }, status: :ok
    rescue Stripe::InvalidRequestError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end
end
