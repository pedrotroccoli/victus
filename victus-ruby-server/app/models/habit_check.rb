class HabitCheck
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia

  belongs_to :habit, class_name: 'Habit' 
  belongs_to :account

  field :checked, type: Boolean, default: false
  field :finished_at, type: DateTime

  # Delta
  embeds_many :habit_check_deltas
  accepts_nested_attributes_for :habit_check_deltas, allow_destroy: true

  # Validations
  validates :checked, presence: true
  validate :validate_time

  validate :rule_engine_validation

  private

  def and_validation
    and_ids = habit.rule_engine_details[:logic][:and]
    # Convert string IDs to BSON::ObjectId for proper querying
    and_ids_converted = and_ids.map { |id| id.is_a?(String) ? BSON::ObjectId.from_string(id) : id }

    # Filter habit checks by today's date range
    today_start = Time.current.beginning_of_day
    today_end = Time.current.end_of_day

    todays_checks = HabitCheck.where(:habit_id.in => and_ids_converted)
                              .where(:created_at.gte => today_start)
                              .where(:created_at.lte => today_end)

    # Get unique habit IDs that have checks today
    checked_habit_ids = todays_checks.distinct(:habit_id)

    if checked_habit_ids.count != and_ids.count
      errors.add(:rule_engine, "Not all habit checks are present")
      return
    end

    # For AND logic: each child habit must have at least one check with checked=true today
    # Group checks by habit_id and verify each has at least one checked=true
    and_ids_converted.each do |child_habit_id|
      child_checks = todays_checks.select { |hc| hc.habit_id == child_habit_id }
      unless child_checks.any? { |hc| hc.checked }
        errors.add(:rule_engine, "Not all habit checks children are checked")
        return
      end
    end
  end

  def or_validation
    or_ids = habit.rule_engine_details[:logic][:or]
    or_ids_converted = or_ids.map { |id| id.is_a?(String) ? BSON::ObjectId.from_string(id) : id }

    # Filter habit checks by today's date range
    today_start = Time.current.beginning_of_day
    today_end = Time.current.end_of_day

    todays_checks = HabitCheck.where(:habit_id.in => or_ids_converted)
                              .where(:created_at.gte => today_start)
                              .where(:created_at.lte => today_end)

    # For OR logic: at least ONE child habit must have a check with checked=true today
    unless todays_checks.any? { |habit_check| habit_check.checked }
      errors.add(:rule_engine, "At least one habit check child must be checked")
    end
  end

  def rule_engine_validation
    return unless habit.rule_engine_enabled

    if habit.rule_engine_details[:logic][:type] == 'and'
      and_validation
    end

    if habit.rule_engine_details[:logic][:type] == 'or'
      or_validation
    end
  end

  def validate_time
    habit_rule = habit.recurrence_details[:rule]

    unless habit_rule.present?
      errors.add(:habit_rule, "Habit has no recurrence rule")
      return
    end

    rrule = RruleInternal.new(habit_rule)

    unless rrule.is_in_range?(Time.current)
      errors.add(:out_of_date_range, "Habit check is out of date range")
    end
    
    if (checked) 
      self.finished_at = Time.now
    else
      self.finished_at = nil
    end
  end
end