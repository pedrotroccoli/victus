class AuditLog
  include Mongoid::Document
  include Mongoid::Timestamps

  field :auditable_type, type: String
  field :auditable_id,   type: BSON::ObjectId
  field :action,         type: String 
  field :item_changes,        type: Hash
  field :user_id,        type: BSON::ObjectId 

  index({ auditable_type: 1, auditable_id: 1 })
end
