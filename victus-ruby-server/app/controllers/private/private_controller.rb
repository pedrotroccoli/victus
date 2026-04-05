class Private::PrivateController < ApplicationController
  include ActiveAndAuthorized

  rescue_from Mongoid::Errors::DocumentNotFound, Mongoid::Errors::InvalidFind, BSON::Error, with: :not_found

  def index
    render json: { message: 'Private area' }, status: :ok
  end

  private

  def not_found
    render json: { error: 'Not found' }, status: :not_found
  end
end