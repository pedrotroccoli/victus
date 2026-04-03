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

      already_exists = Account.find_by(email: accounts_params[:email])

      return render json: { message: 'Account already exists' }, status: :unauthorized if already_exists

      account = Account.new(accounts_params)

      lookup_key = params[:lookup_key]

      checkout_url = nil

      if lookup_key.present?
        stripe_service = StripeService.new

        customer = stripe_service.create_customer(email: accounts_params[:email])

        account.subscription = Subscription.create(
          service_type: 'stripe',
          status: 'freezed',
          sub_status: 'pending_payment_information',
          service_details: {
            customer_id: customer.id,
          }
        )

        checkout_session = stripe_service.create_checkout(
          customer_id: customer.id,
          account_id: account.id,
          lookup_key: lookup_key
        )

        checkout_url = checkout_session.url
      else
        account.create_trial_subscription
      end

      if account.save
        account.subscription.save

        EmailJob.perform_later(account.id)

        render json: { token: account.generate_jwt, message: 'Signed up successfully', checkout_url: checkout_url }, status: :ok
      else
        render json: { message: 'Something went wrong' }, status: :unauthorized
      end
    end

    def start_siwe_auth
      nonce = Siwe::Util.generate_nonce

      cookies.signed[:siwe_nonce] = {
        value: nonce,
        path: '/',
        httponly: true,
        secure: Rails.env.production?
      }

      render json: { nonce: nonce }, status: :ok
    end

    def siwe_verify
      siwe_params = params[:payload]
      nonce = params[:nonce]

      if siwe_params.blank? || nonce.blank?
        return render json: { message: 'Invalid message -1' }, status: :unauthorized
      end

      # Initialize AWS Lambda client
      lambda_client = Aws::Lambda::Client.new(
        region: 'us-east-1',
      )

      lambda_payload = {
        payload: siwe_params,
        nonce: nonce
      }.to_json

      lambda_response = lambda_client.invoke({
        function_name: 'victus-siwe-dev-world-siwe-verify',
        invocation_type: 'RequestResponse',
        payload: lambda_payload
      })

      response_body = JSON.parse(lambda_response.payload.read)

      if lambda_response.status_code != 200
        return render json: { message: 'Something went wrong' }, status: :unauthorized
      end

      if response_body['valid'] == false
        return render json: { message: 'Invalid message' }, status: :unauthorized
      end

      address = response_body['data']['address']
      account = Account.find_or_create_from_siwe(address)

      return render json: { message: 'Invalid SIWE address' }, status: :unauthorized if account.nil?

      render json: { message: 'Signed in successfully', token: account.generate_jwt, account: account }, status: :ok
    rescue StandardError => e
      Rails.logger.error("SIWE verification failed: #{e.class}: #{e.message}")
      render json: { message: 'Invalid message 1' }, status: :unauthorized
    end

    def google_auth
      id_token = params[:id_token]

      return render json: { message: 'Missing id_token' }, status: :bad_request if id_token.blank?

      validator = GoogleIDToken::Validator.new
      payload = validator.check(id_token, ENV['GOOGLE_CLIENT_ID'])

      return render json: { message: 'Invalid Google token' }, status: :unauthorized if payload.nil?

      account = Account.find_or_create_from_google(
        google_id: payload['sub'],
        email: payload['email'],
        name: payload['name']
      )

      render json: { message: 'Signed in successfully', token: account.generate_jwt }, status: :ok
    rescue GoogleIDToken::ValidationError => e
      render json: { message: 'Invalid Google token', error: e.message }, status: :unauthorized
    rescue Mongoid::Errors::MongoidError => e
      render json: { message: 'Unable to sign in with Google', error: e.message }, status: :unprocessable_entity
    end
  end
end
