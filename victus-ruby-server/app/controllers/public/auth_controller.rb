module Public
  class AuthController < ApplicationController
    def sign_in
      accounts_params = params.require(:account).permit(:email, :password)

      account = Account.authenticate_with_email(accounts_params[:email], accounts_params[:password])

      if account
        account.ensure_provider('web')
        account.save

        render json: { message: 'Signed in successfully', token: account.generate_jwt }, status: :ok
      else
        render json: { message: 'Invalid email or password' }, status: :unauthorized
      end
    end

    def sign_up
      accounts_params = params.require(:account).permit(:email, :password, :name, :phone, :password_confirmation)

      if accounts_params[:password] != accounts_params[:password_confirmation]
        return render json: { message: 'Password and password confirmation do not match' }, status: :unauthorized
      end

      return render json: { message: 'Account already exists' }, status: :unauthorized if Account.where(email: accounts_params[:email]).first

      result = Account.sign_up_with_email(accounts_params, lookup_key: params[:lookup_key])

      if result
        render json: { token: result[:account].generate_jwt, message: 'Signed up successfully', checkout_url: result[:checkout_url] }, status: :ok
      else
        render json: { message: 'Something went wrong' }, status: :unauthorized
      end
    end

    def start_siwe_auth
      nonce = Siwe::Util.generate_nonce

      render json: { nonce: nonce }, status: :ok
    end

    def siwe_verify
      account = Account.authenticate_with_siwe(payload: params[:payload], nonce: params[:nonce])

      if account
        render json: { message: 'Signed in successfully', token: account.generate_jwt, account: AccountSerializer.new(account) }, status: :ok
      else
        render json: { message: 'Invalid message' }, status: :unauthorized
      end
    rescue StandardError => e
      Rails.logger.error("SIWE verification failed: #{e.class}: #{e.message}")
      render json: { message: 'Invalid message' }, status: :unauthorized
    end

    def google_auth
      return render json: { message: 'Missing id_token' }, status: :bad_request if params[:id_token].blank?

      account = Account.authenticate_with_google(id_token: params[:id_token])

      if account
        render json: { message: 'Signed in successfully', token: account.generate_jwt }, status: :ok
      else
        render json: { message: 'Invalid Google credentials' }, status: :unauthorized
      end
    rescue GoogleIDToken::ValidationError => e
      render json: { message: 'Invalid Google token', error: e.message }, status: :unauthorized
    rescue Mongoid::Errors::MongoidError => e
      Rails.logger.error("Google auth failed: #{e.class}: #{e.message}")
      render json: { message: 'Unable to sign in with Google' }, status: :unprocessable_entity
    end
  end
end
