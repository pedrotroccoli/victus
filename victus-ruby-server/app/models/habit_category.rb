class HabitCategory 
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :account

  has_many :habits, class_name: 'Habit', dependent: :nullify

  field :name, type: String
  field :order, type: Float, default: 0
  field :icon, type: String

  validates :name, presence: true, uniqueness: { scope: :account_id }
end
