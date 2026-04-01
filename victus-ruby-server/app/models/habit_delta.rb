class HabitDelta
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia

  embedded_in :habit

  field :type, type: String
  field :name, type: String
  field :description, type: String
  field :enabled, type: Boolean, default: true

  validates :type, presence: true
  validates :name, presence: true

  validate :validate_type

  def self.types
    %w(number string time)
  end

  private
    def validate_type
      unless self.class.types.include?(type)
        errors.add(:type, "must be one of #{self.class.types.join(', ')}")
      end
    end
end