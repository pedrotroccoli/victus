class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :phone, :connected_providers

  has_one :subscription, serializer: SubscriptionSerializer
end
