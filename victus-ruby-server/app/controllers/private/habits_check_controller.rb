module Private
class HabitsCheckController < Private::PrivateController
  before_action :get_habit, only: [:show, :index, :create, :update]
  before_action :get_habit_check, only: [:show, :update]

  def all
    week_days = 7

    start_date = DateInternal.parse(params[:start_date], Date.today - week_days)
    end_date = DateInternal.parse(params[:end_date], Date.today + week_days)

    habit_checks = HabitCheck.where(account_id: @current_account[:id])
                             .where(:finished_at.gte => start_date.beginning_of_day, :finished_at.lte => end_date.end_of_day)

    render json: habit_checks
  end

  def index
    habit_checks = @habit.habit_checks

    render json: habit_checks
  end
  
  def show
    render json: @habit_check
  end

  def update
    @habit_check.sync_deltas(update_params[:habit_check_deltas_attributes])
    @habit_check.update!(update_params.except(:habit_check_deltas_attributes))

    render json: @habit_check, status: :ok
  rescue Mongoid::Errors::Validations
    render json: { errors: @habit_check.errors.full_messages }, status: :unprocessable_entity
  end

  def create
     today_start = Time.current.beginning_of_day
     today_end = Time.current.end_of_day
     already_checked = @habit.habit_checks.where(account_id: @current_account[:id])
     .where(:created_at.gte => today_start, :created_at.lte => today_end).first
     
    #  if already_checked.present?
    #    render json: { error: 'Already checked today' }, status: :unprocessable_entity
    #    return
    #  end

     habit_check = @habit.habit_checks.new(checked: create_params[:checked])

     deltas_params = create_params[:deltas]

     if deltas_params.present?
      deltas_params.each do |delta|
        delta = HabitCheckDelta.create(habit_delta_id: delta[:habit_delta_id], value: delta[:value], habit_check: habit_check)

        if delta.valid?
          habit_check.habit_check_deltas << delta
        else
          return render json: { errors: delta.errors.full_messages }, status: :unprocessable_entity
        end
      end
     end

     habit_check.account_id = @current_account[:id]

     habit_check.save!

     render json: habit_check, status: :created
    rescue => e
      render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  private

  def get_habit
    @habit = Habit.where(account_id: @current_account[:id]).find(params[:habit_id].to_s)
  rescue Mongoid::Errors::DocumentNotFound
    render(json: { error: 'Habit not found' }, status: :not_found) and return
  end

  def get_habit_check
    return if performed?

    @habit_check = @habit.habit_checks.find(params[:id].to_s)
  rescue Mongoid::Errors::DocumentNotFound
    render(json: { error: 'Habit check not found' }, status: :not_found) and return
  end

  def update_params
    params.permit(:checked, habit_check_deltas_attributes: [[:habit_delta_id, :value, :_destroy]])
  end

  def create_params
    params.permit(:checked, deltas: [[:habit_delta_id, :value]])
  end
end
end