Rails.application.routes.draw do
  if defined?(Rswag::Ui::Engine)
    mount Rswag::Ui::Engine => '/api-docs'
    mount Rswag::Api::Engine => '/api-docs'
  end

  get 'ping', to: 'ping#index'
    post 'ping', to: 'ping#index'

    scope :api do
      scope :v1 do
        scope module: 'private' do
          get 'auth/test', to: 'auth#test'

          get 'me', to: 'me#me'
          put 'me', to: 'me#update_me'

          get 'habits/:id', to: 'habits#show'
          get 'habits', to: 'habits#index'
          post 'habits', to: 'habits#create'
          put 'habits/:id', to: 'habits#update'
          delete 'habits/:id', to: 'habits#destroy'

          resources :habits

          get 'habits-check', to: 'habits_check#all'
          get 'habits-check/:habit_id', to: 'habits_check#index'
          get 'habits-check/:habit_id/:check_id', to: 'habits_check#show'
          post 'habits-check/:habit_id', to: 'habits_check#create'
          put 'habits-check/:habit_id/:check_id', to: 'habits_check#update'

          resources :habits_category, only: [:index, :create, :update, :destroy]
          resources :mood

          post 'checkout/create', to: 'checkout#create'

          get 'plans', to: 'plans#index'

          get 'subscription', to: 'subscription#show'
          post 'subscription/cancel', to: 'subscription#cancel'
          post 'subscription/create_session', to: 'subscription#create_session'
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
