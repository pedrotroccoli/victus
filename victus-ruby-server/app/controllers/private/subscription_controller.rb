module Private
  class SubscriptionController < Private::PrivateController
    def show
      subscription = @current_account.subscription

      if subscription.nil?
        return render json: { error: 'No subscription found' }, status: :not_found
      end

      stripe_subscription = subscription.stripe_details

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

  end
end
