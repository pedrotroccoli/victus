Rails.application.routes.draw do
  mount Rswag::Api::Engine => '/api-docs' if defined?(Rswag::Api::Engine)

  if Rails.env.development?
    get 'dev/api-docs', to: 'api_docs#index'
  end

  get 'ping', to: 'ping#index'
    post 'ping', to: 'ping#index'

    scope :api do
      scope :v1 do
        scope module: 'private' do
          get 'auth/test', to: 'auth#test'

          get 'me', to: 'me#me'
          put 'me', to: 'me#update_me'

          resources :habits do
            resources :checks, controller: 'habits_check', only: [:index, :show, :create, :update]
          end
          get 'checks', to: 'habits_check#all'

          resources :habits_category, only: [:index, :create, :update, :destroy]
          resources :mood

          post 'checkout/create', to: 'checkout#create'

          get 'plans', to: 'plans#index'

          resource :subscription, controller: 'subscription', only: [:show] do
            scope module: :subscriptions do
              resource :cancellation, only: [:create]
              resource :portal_session, only: [:create]
            end
          end
      end

      scope module: 'public' do
        post 'auth/sign-in', to: 'auth#sign_in'
        post 'auth/sign-up', to: 'auth#sign_up'

        get 'auth/start_siwe_auth', to: 'auth#start_siwe_auth'
        post 'auth/siwe_verify', to: 'auth#siwe_verify'

        post 'auth/google_auth', to: 'auth#google_auth'
      end

      scope module: 'internal' do
        post 'stripe/webhook', to: 'stripe_webhook#webhook'
      end
    end
  end
end
