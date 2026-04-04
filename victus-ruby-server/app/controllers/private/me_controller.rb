module Private
  class MeController < Private::PrivateController
    skip_before_action :check_subscription, only: :me

    def me
      render json: @current_account, serializer: AccountSerializer, status: :ok
    end

    def update_me
      if params[:password].present? && params[:password] != params[:password_confirmation]
        return render json: { code: 'PASSWORD_MISMATCH' }, status: :unprocessable_entity
      end

      if @current_account.update(account_params)
        render json: @current_account, serializer: AccountSerializer, status: :ok
      else
        render json: { errors: @current_account.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def account_params
      params.require(:account).permit(:name, :phone, :password, :password_confirmation)

    end
  end
end
