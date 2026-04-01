module ActiveAndAuthorized
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
    before_action :check_subscription
  end
end 