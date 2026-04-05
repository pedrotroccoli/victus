class ApplicationController < ActionController::Base
  # Protects from CSRF attacks by raising an exception.
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = JWT.decode(header, ENV.fetch('JWT_SECRET') { raise KeyError, 'Missing JWT_SECRET' unless Rails.env.test?; 'test_secret' }, true, { algorithm: 'HS256', verify_expiration: true, required_claims: ['exp'] })

    @current_account = Account.find(decoded[0]['account_id'].to_s) if decoded
  rescue Mongoid::Errors::DocumentNotFound, Mongoid::Errors::InvalidFind, BSON::Error, JWT::MissingRequiredClaim, JWT::DecodeError
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def check_subscription
    unless @current_account&.subscription_active?
      render json: { error: 'Without a valid subscription' }, status: :payment_required
    end
  end
end
