module Private
class HabitsCategoryController < Private::PrivateController
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
    @habits_category = HabitCategory.find(params[:id])
    @habits_category.update(habits_category_params)

    render json: @habits_category, status: :ok
  end

  def destroy
    @habits_category = HabitCategory.find(params[:id])
    @habits_category.destroy
  end

  private

  def habits_category_params
    params.require(:habits_category).permit(:name, :order, :icon)
  end
end
end