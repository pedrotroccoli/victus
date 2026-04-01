class Private::PrivateController < ApplicationController
  include ActiveAndAuthorized

  def index
    render json: { message: 'Private area' }, status: :ok
  end
end