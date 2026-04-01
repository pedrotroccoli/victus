class SubscriptionSerializer < ActiveModel::Serializer
  attributes :id, :status, :service_type, :service_details, :sub_status

  has_one :account, serializer: AccountSerializer
end
