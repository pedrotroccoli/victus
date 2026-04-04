module Private
class HabitsCategoryController < Private::PrivateController
  rescue_from Mongoid::Errors::DocumentNotFound, Mongoid::Errors::InvalidFind, BSON::ObjectId::Invalid, with: :not_found

  before_action :set_category, only: [:update, :destroy]

  def index
    @habits_categories = HabitCategory.where(account_id: @current_account[:id]).order(order: :asc)

    render json: @habits_categories
  end

  def create
    @habits_category = HabitCategory.new(habits_category_params)
    @habits_category.account_id = @current_account[:id]

    @habits_category.save!

    render json: @habits_category, status: :created
  end

  def update
    if @habits_category.update(habits_category_params)
      render json: @habits_category, status: :ok
    else
      render json: { errors: @habits_category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @habits_category.destroy
    head :no_content
  end

  private

  def set_category
    @habits_category = @current_account.habit_categories.find(params[:id])
  end

  def not_found
    render json: { error: 'Not found' }, status: :not_found
  end

  def habits_category_params
    params.require(:habits_category).permit(:name, :order, :icon)
  end
end
end