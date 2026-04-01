module Private
  module Subscriptions
    class PortalSessionsController < Private::PrivateController
      def create
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
end
