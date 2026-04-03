module Private
  module Subscriptions
    class CancellationsController < Private::PrivateController
      rescue_from Stripe::InvalidRequestError do |e|
        render json: { error: e.message }, status: :unprocessable_entity
      end

      def create
        subscription = @current_account.subscription

        if subscription.service_details&.dig('subscription_id').blank?
          return render json: { error: 'No active Stripe subscription' }, status: :unprocessable_entity
        end

        immediate = params[:immediate] == true || params[:immediate] == 'true'
        stripe_subscription = subscription.cancel!(immediate: immediate, reason: params[:reason])

        render json: {
          message: immediate ? 'Subscription cancelled' : 'Subscription will cancel at period end',
          cancel_at: stripe_subscription.cancel_at || stripe_subscription.current_period_end
        }, status: :ok
      end
    end
  end
end
