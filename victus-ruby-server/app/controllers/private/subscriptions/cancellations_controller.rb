module Private
  module Subscriptions
    class CancellationsController < Private::PrivateController
      def create
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
    end
  end
end
