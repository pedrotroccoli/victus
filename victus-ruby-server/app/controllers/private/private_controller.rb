class Private::PrivateController < ApplicationController
  include ActiveAndAuthorized
  include RateLimited

  rate_limit to: 60, within: 1.minute,
            by: -> { @current_account&.id || request.remote_ip },
            with: -> { render_rate_limited }

  rescue_from Mongoid::Errors::DocumentNotFound, Mongoid::Errors::InvalidFind, BSON::Error::InvalidObjectId, with: :not_found

  def index
    render json: { message: 'Private area' }, status: :ok
  end

  private

  def not_found
    render json: { error: 'Not found' }, status: :not_found
  end
end