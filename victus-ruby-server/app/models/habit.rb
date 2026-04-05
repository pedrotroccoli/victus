class Habit
  include Mongoid::Document
  include Mongoid::Timestamps

  include Auditable

  belongs_to :account
  has_many :habit_checks, dependent: :destroy
  belongs_to :habit_category, optional: true

  belongs_to :parent_habit, class_name: 'Habit', optional: true
  has_many :children_habits, class_name: 'Habit', foreign_key: :parent_habit_id, dependent: :destroy

  # Scopes
  scope :active,    -> { where(finished_at: nil, paused_at: nil) }
  scope :paused,    -> { where(:paused_at.exists => true, :paused_at.ne => nil) }
  scope :finished,  -> { where(:finished_at.exists => true, :finished_at.ne => nil) }
  scope :ordered,   -> { order_by(order: :asc) }
  scope :preloaded, -> { includes(:habit_category) }
  scope :in_range,  ->(start_date, end_date) {
    where(:start_date.lte => end_date)
      .any_of({ :end_date.gte => start_date }, { end_date: nil })
  }

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

