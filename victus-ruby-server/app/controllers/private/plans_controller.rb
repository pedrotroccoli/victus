monthly = Rails.env.production? ? 'victus_journal_monthly' : 'dev_victus_journal_monthly'
yearly = Rails.env.production? ? 'victus_journal_yearly' : 'dev_victus_journal_yearly'

    PLANS = [
      {
        plan_key: 'monthly',
        key: monthly,
        price: 'R$ 15,00',
        features: [
          {
            key: 'monthly_habit_creation',
          },
          {
            key: 'monthly_delta_creation',
          },
          {
            key: 'monthly_analytics',
          },
          {
            key: 'monthly_support',
          }
        ]
      },
      {
        plan_key: 'yearly',
        key: yearly,
        price: 'R$ 8,33',
        features: [
          {
            key: 'yearly_habit_creation',
          },
          {
            key: 'yearly_delta_creation',
          },
          {
            key: 'yearly_analytics',
          },
          {
            key: 'yearly_support',
          }
        ]
      }
    ]


class Private::PlansController < Private::PrivateController
  skip_before_action :check_subscription

  def index
    render json: PLANS, status: :ok
  end
end
