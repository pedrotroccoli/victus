module Private
  module Subscriptions
    class PortalSessionsController < Private::PrivateController
      def create
        subscription = @current_account.subscription

        if subscription.service_details&.dig('customer_id').blank?
          return render json: { error: 'No customer ID found' }, status: :unprocessable_entity
        end

        session_url = subscription.portal_session_url(
          return_url: "#{ENV['APP_URL']}/account/subscription"
        )

        render json: { session_url: session_url }, status: :ok
      rescue Stripe::InvalidRequestError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end
