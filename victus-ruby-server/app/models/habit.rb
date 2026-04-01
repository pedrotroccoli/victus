class Habit 
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia
  include Auditable

  belongs_to :account
  has_many :habit_checks, dependent: :destroy
  belongs_to :habit_category, optional: true

  belongs_to :parent_habit, class_name: 'Habit', optional: true
  has_many :children_habits, class_name: 'Habit', foreign_key: :parent_habit_id, dependent: :destroy

  field :rule_engine_enabled, type: Boolean, default: false 
  field :rule_engine_details, type: Hash

  field :name, type: String
  field :description, type: String

  field :order, type: Float, default: nil

  field :start_date, type: Time
  field :end_date, type: Time

  field :finished_at, type: Time, default: nil
  field :paused_at, type: Time, default: nil

  field :last_check, type: Time

  # infinite, daily, weekly, monthly, yearly
  field :recurrence_type, type: String
  field :recurrence_details, type: Hash

  # Delta configuration
  field :delta_enabled, type: Boolean, default: false
  embeds_many :habit_deltas, cascade_callbacks: true
  accepts_nested_attributes_for :habit_deltas, allow_destroy: true

  # Validations
  validates :name, presence: true
  validates :start_date, presence: true
  validates :recurrence_type, presence: true
end

