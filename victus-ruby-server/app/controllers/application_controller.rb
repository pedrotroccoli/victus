class ApplicationController < ActionController::Base
  # Protects from CSRF attacks by raising an exception.
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = JWT.decode(header, ENV['JWT_SECRET'], true, { algorithm: 'HS256' })

    @current_account = Account.find(decoded[0]['account_id'].to_s) if decoded

    raise ActiveRecord::RecordNotFound if @current_account.nil?
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def check_subscription
    if @current_account&.subscription&.status != 'active'
      render json: { error: 'Without a valid subscription' }, status: :payment_required
    end
  end
end
