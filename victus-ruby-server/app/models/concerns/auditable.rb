module Auditable
  extend ActiveSupport::Concern

  included do
    after_create  :log_create
    before_update :store_changes
    after_update  :log_update
    after_destroy :log_destroy
    
    attr_accessor :stored_changes
  end

  private

  def store_changes
    self.stored_changes = self.changes.except("_id", "updated_at", "created_at")
  end

  def log_create
    AuditLog.create!(
      auditable_type: self.class.name,
      auditable_id: self.id,
      action: "create",
      item_changes: self.attributes
    )
  end

  def log_update
    return if stored_changes.blank? || stored_changes.empty?
    
    AuditLog.create!(
      auditable_type: self.class.name,
      auditable_id: self.id,
      action: "update",
      item_changes: stored_changes
    )
  end

  def log_destroy
    AuditLog.create!(
      auditable_type: self.class.name,
      auditable_id: self.id,
      action: "destroy",
      item_changes: self.attributes
    )
  end
end