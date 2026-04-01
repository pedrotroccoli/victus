module Private
  class MoodController < Private::PrivateController
    before_action :set_mood, only: [:show, :update, :destroy]

    def index
      @moods = Mood.where(account_id: @current_account[:id])
        .order_by(created_at: :desc)

      render json: @moods, status: :ok
    end

    def show
      render json: @mood, status: :ok
    end

    def create
      @mood = Mood.new(mood_params)
      @mood.account = @current_account

      if @mood.save
        render json: @mood, status: :created
      else
        render json: { errors: @mood.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      unless @mood.within_edit_window?
        return render json: { errors: ["só é possível editar o mood no mesmo dia e hora em que foi criado"] }, status: :unprocessable_entity
      end

      if @mood.update(mood_params)
        render json: @mood, status: :ok
      else
        render json: { errors: @mood.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @mood.destroy

      render json: { message: 'Humor deletado com sucesso' }, status: :ok
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end

    private

    def set_mood
      @mood = Mood.where(account_id: @current_account[:id]).find(params[:id])
    end

    def mood_params
      params.require(:mood).permit(:value, :description)
    end
  end
end
