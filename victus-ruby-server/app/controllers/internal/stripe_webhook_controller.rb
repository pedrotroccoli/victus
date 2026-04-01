WEBHOOK_SECRET = ENV['STRIPE_WEBHOOK_SECRET']

module Internal
class StripeWebhookController < ApplicationController
  before_action :verify_signature

  def webhook
    event = @event

    event_type = event.type
    data_object = event.data.object

    case event_type
    when 'customer.subscription.created'
      handle_subscription_created(data_object)
    when 'customer.subscription.updated'
      handle_subscription_updated(data_object)
    when 'customer.subscription.deleted'
      handle_subscription_deleted(data_object)
    when 'invoice.paid'
      handle_invoice_paid(data_object)
    when 'invoice.payment_failed'
      handle_payment_failed(data_object)
    else
      Rails.logger.info("Unhandled Stripe event type: #{event_type}")
    end

    render json: {}, status: 201
  end

  private
    def handle_subscription_deleted(data_object)
      customer_id = data_object.customer

      subscription = Subscription.find_by("service_details.customer_id" => customer_id)

      return if subscription.nil?

      subscription.status = 'cancelled'
      subscription.cancel_date = Time.now
      subscription.cancel_reason = 'Subscription deleted via Stripe'
      subscription.save!
    end

    def handle_invoice_paid(data_object)
      customer_id = data_object.customer
      subscription = Subscription.find_by("service_details.customer_id" => customer_id)
      
      return if subscription.nil?
      
      subscription.status = 'active'
      subscription.sub_status = 'success'
      subscription.save!
    end

    def handle_subscription_created(data_object)
      customer_id = data_object.customer
      subscription = Subscription.find_by("service_details.customer_id" => customer_id)

      return if subscription.nil?

      stripe_subscription_id = data_object.id
      trial_ends_at = data_object.trial_end
      status = map_stripe_status(data_object.status)
      sub_status = data_object.trial_end ? 'trial' : 'success'

      subscription.status = status
      subscription.sub_status = sub_status
      subscription.service_details = subscription.service_details.merge({
        'subscription_id' => stripe_subscription_id,
        'trial_ends_at' => trial_ends_at,
        'plan_id' => data_object.items.data.first&.price&.id
      })
      subscription.save!
    end

    def handle_subscription_updated(data_object)
      customer_id = data_object.customer
      subscription = Subscription.find_by("service_details.customer_id" => customer_id)

      return if subscription.nil?

      status = map_stripe_status(data_object.status)
      sub_status = subscription.sub_status

      if data_object.cancel_at_period_end
        sub_status = 'pending_cancellation'
      elsif data_object.status == 'active' && subscription.sub_status != 'trial'
        sub_status = 'success'
      end

      subscription.status = status
      subscription.sub_status = sub_status
      subscription.service_details = subscription.service_details.merge({
        'current_period_end' => data_object.current_period_end,
        'cancel_at_period_end' => data_object.cancel_at_period_end
      })
      subscription.save!
    end

    def map_stripe_status(stripe_status)
      case stripe_status
      when 'active', 'trialing'
        'active'
      when 'canceled', 'unpaid'
        'cancelled'
      when 'past_due', 'incomplete', 'incomplete_expired', 'paused'
        'freezed'
      else
        'freezed'
      end
    end

    def handle_payment_failed(data_object)
      customer_id = data_object.customer
      subscription = Subscription.find_by("service_details.customer_id" => customer_id)

      return if subscription.nil?

      failed_payments = subscription.service_details&.dig('failed_payments') || 0
      failed_payments += 1

      if failed_payments >= 3
        subscription.status = 'freezed'
        subscription.sub_status = 'payment_failed'
      end

      subscription.service_details = subscription.service_details.merge({
        'failed_payments' => failed_payments
      })
      subscription.save!
    end

    def verify_signature 
      payload = request.body.read
      sig_header = request.env['HTTP_STRIPE_SIGNATURE']
      event = nil

      if (payload.nil? || sig_header.nil?)
        render json: { error: 'Missing payload or signature header' }, status: 400
        return
      end

      begin 
        @event = Stripe::Webhook.construct_event(
          payload, sig_header, WEBHOOK_SECRET
        )
      rescue JSON::ParserError => e
        render json: { error: 'Invalid payload' }, status: 400
        return
      rescue Stripe::SignatureVerificationError => e
        render json: { error: 'Invalid signature' }, status: 400
        return
      end  
    end
  end
end