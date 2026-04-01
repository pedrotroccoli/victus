class HabitCheckDelta
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia

  embedded_in :habit_check

  field :habit_delta_id, type: String
  field :value, type: String

  validates :habit_delta_id, presence: true
  validates :value, presence: true

  validate :validate_structure

  private

  def validate_structure
    if habit_check.nil? || habit_check.habit.nil?
      errors.add(:habit_check, "must be associated with a habit") if habit_check.nil?
      errors.add(:habit, "must be associated with a habit") if habit_check.habit.nil?

      return
    end

    deltas_ids = habit_check.habit.habit_deltas.map(&:id).map(&:to_s)

    unless deltas_ids.include?(habit_delta_id)
      errors.add(:habit_delta_id, "must be a valid habit delta, #{habit_delta_id} doesn't exist")
    end
  end
end