module Habits
  class CreateHabitContract < Dry::Validation::Contract
    params do
      required(:name).filled(:string)

      required(:start_date).filled(:date)
      optional(:end_date).filled(:date)
      optional(:order).filled(:integer)

      required(:recurrence_type).filled(:symbol, included_in?: [:infinite, :daily, :weekly, :monthly, :yearly])
      required(:recurrence_details).filled(:hash)

      required(:rule_engine_enabled).filled(:bool)
      optional(:rule_engine_details).filled(:hash)
    end

    rule(:rule_engine_details) do
      next if values[:rule_engine_enabled] == false

      if value.blank? || value[:logic].blank?
        key.failure('logic is required')
        next
      end

      logic = value[:logic]

      if logic[:type].blank?
        key.failure('type is required')
        next
      end

      type_enum = %w(and or)

      unless type_enum.include?(logic[:type])
        key.failure("type is invalid, must be one of #{type_enum.join(', ')}")
        next
      end

      type = logic[:type]

      unless logic[type.to_sym].blank? || logic[type.to_sym].is_a?(Array)
        key.failure("#{type} condition is required and must be an array")
        next
      end

      unless logic[type.to_sym].all? { |condition| condition.is_a?(String) }
        key.failure("#{type} condition must be an array of strings")
        next
      end
    end
    
    rule(:recurrence_details) do
      if value.blank? || value[:rule].blank?
        key.failure('rule is required')
        next
      end

      if !RruleInternal.validate_rrule(value[:rule])
        key.failure('rule is invalid')
        next
      end
    end

    rule(:start_date, :end_date) do
      start_date = values[:start_date]

      if start_date < Date.today
        key(:start_date).failure('must be today or in the future')
        next
      end

      end_date = values[:end_date]

      next if end_date.blank?

      if start_date > end_date
        key(:start_date).failure('must be before end_date')
        key(:end_date).failure('must be after start_date')
      end
    end
  end
end

