class Mood
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia

  VALUES = %w[terrible bad neutral good great amazing].freeze

  field :value, type: String
  field :description, type: String
  field :hour_block, type: Integer
  field :date, type: Date

  belongs_to :account

  validates :value, presence: true, inclusion: { in: VALUES, message: "deve ser um dos valores: #{VALUES.join(', ')}" }
  validates :hour_block, presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 23 }
  validates :date, presence: true
  validates :hour_block, uniqueness: { scope: [:account_id, :date],
            message: "já existe um mood registrado neste bloco de hora" }

  before_validation :set_hour_block_and_date, on: :create

  def within_edit_window?
    now = Time.current
    date == now.to_date && hour_block == now.hour
  end

  private

  def set_hour_block_and_date
    now = Time.current
    self.hour_block ||= now.hour
    self.date ||= now.to_date
  end
end
