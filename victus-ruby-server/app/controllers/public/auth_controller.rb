module Public
  class AuthController < ApplicationController
    def sign_in
      accounts_params = params.require(:account).permit(:email, :password)

      account = Account.find_by(email: accounts_params[:email])

      if account && account.authenticate(accounts_params[:password])
        if !account.connected_providers.include?('web')
          account.connected_providers << 'web'
          account.save
        end

        token = JWT.encode({ account_id: account.id }, ENV['JWT_SECRET'], 'HS256')

        render json: { message: 'Signed in successfully', token: token }, status: :ok
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
        token = JWT.encode({ account_id: account.id }, ENV['JWT_SECRET'], 'HS256')

        EmailJob.perform_later(account.id)

        render json: { token: token, message: 'Signed up successfully', checkout_url: checkout_url }, status: :ok
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

      account = Account.find_or_create_by(world_address: response_body['data']['address'])

      if !account.new_record?
        token = JWT.encode({ account_id: account.id }, ENV['JWT_SECRET'], 'HS256')

        if !account.connected_providers.include?('worldapp')
          account.connected_providers << 'worldapp'
          account.save
        end

        if account.subscription.nil?
          account.subscription = Subscription.new(
          status: 'active',
          sub_status: 'active',
          service_type: 'worldapp',
          service_details: {
            # trial_ends_at: 14.days.from_now
          }
          )

        account.subscription.save

        end

        return render json: { message: 'Signed in successfully', token: token, account: account }, status: :ok
      end

      account.connected_providers << 'worldapp'

      account.subscription = Subscription.new(
        status: 'active',
        sub_status: 'active',
        service_type: 'worldapp',
        service_details: {
          # trial_ends_at: 14.days.from_now
        }
      )
      if account.save
        token = JWT.encode({ account_id: account.id }, ENV['JWT_SECRET'], 'HS256')

        render json: { message: 'Signed in successfully', token: token }, status: :ok
      else
        render json: { message: 'Something went wrong' }, status: :unauthorized
      end
      
    rescue Exception => e
      render json: { message: 'Invalid message 1', error: e }, status: :unauthorized
    end

    def google_auth
      id_token = params[:id_token]

      return render json: { message: 'Missing id_token' }, status: :bad_request if id_token.blank?

      validator = GoogleIDToken::Validator.new
      payload = validator.check(id_token, ENV['GOOGLE_CLIENT_ID'])

      return render json: { message: 'Invalid Google token' }, status: :unauthorized if payload.nil?

      google_id = payload['sub']
      email = payload['email']
      name = payload['name']

      # Find by google_id first
      account = Account.find_by(google_id: google_id)

      # If not found by google_id, try to find by email (auto-merge)
      if account.nil? && email.present?
        account = Account.find_by(email: email)
        if account
          account.google_id = google_id
        end
      end

      is_new_account = account.nil?

      # Create new account if not found
      if is_new_account
        account = Account.new(
          google_id: google_id,
          email: email,
          name: name
        )
      end

      # Update connected_providers
      if !account.connected_providers.include?('google')
        account.connected_providers << 'google'
      end

      # Create 14-day trial subscription for new accounts
      account.create_trial_subscription if is_new_account

      if account.save
        account.subscription&.save if is_new_account

        token = JWT.encode({ account_id: account.id }, ENV['JWT_SECRET'], 'HS256')

        render json: { message: 'Signed in successfully', token: token }, status: :ok
      else
        render json: { message: 'Something went wrong', errors: account.errors.full_messages }, status: :unprocessable_entity
      end
    rescue GoogleIDToken::ValidationError => e
      render json: { message: 'Invalid Google token', error: e.message }, status: :unauthorized
    end
  end
end
