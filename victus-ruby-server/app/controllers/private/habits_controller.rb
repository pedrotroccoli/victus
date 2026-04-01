module Private
class HabitsController < Private::PrivateController
  before_action :set_habit, only: [:show, :update, :destroy]

  def show
    render json: @habit, include: :habit_category
  end

  def index
    week_days = 7

    start_date = DateInternal.parse(params[:start_date], Date.today - week_days).beginning_of_day
    end_date = DateInternal.parse(params[:end_date], Date.today + week_days).end_of_day

    habits_from_account = Habit.where(account_id: @current_account[:id]).includes(:habit_category)

    @habits = habits_from_account
    .where(:start_date.lte => end_date)
    .any_of(
      { :end_date.gte => start_date },
      { :end_date => nil }
    )
    .order_by(order: :asc)

    render json: @habits.as_json(include: :habit_category)
  end

  def update
    params_hash = update_params

    if !params_hash[:paused].nil?
      params_hash[:paused_at] = params_hash[:paused] ? Time.current : nil
      params_hash.delete(:paused)
    end

    if params_hash[:finished].present?
      params_hash[:finished_at] = Time.current
      params_hash.delete(:finished)
    end

    if @habit.update(params_hash)
      render json: @habit, include: :habit_category, status: :ok
    else
      render json: { errors: @habit.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def create
    operation = Habits::Create.call(params: create_params, account: @current_account)

    if operation.success?
      render json: operation[:habit], include: :habit_category, status: :created
    else
      render json: { errors: operation[:errors] }, status: :unprocessable_entity
    end
  end

  def destroy
    @habit.destroy

    render json: { message: 'Hábito deletado com sucesso' }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_habit
    @habit = Habit.where(account_id: @current_account[:id]).find(params[:id])
  end

  def create_params
    params.require(:habit).permit(
      :name,
      :description,
      :start_date,
      :end_date,
      :order,
      :recurrence_type,
      :delta_enabled,
      :rule_engine_enabled,
      :parent_habit_id,
      :habit_category_id,
      habit_deltas: [:type, :name, :description, :enabled],
      recurrence_details: [:rule],
      rule_engine_details: [logic: [:type, and: [], or: []]],
      children_habit_ids: []
    )
  end

  def update_params
    params.require(:habit).permit(
      :order,
      :name,
      :habit_category_id,
      :delta_enabled,
      :recurrence_type,
      :paused,
      :finished,
      :rule_engine_enabled,
      :parent_habit_id,
      recurrence_details: [:rule],
      habit_deltas_attributes: [:id, :name, :description, :enabled, :_destroy],
      rule_engine_details: [logic: [:type, and: [], or: []]]
    )
  end
end
end
