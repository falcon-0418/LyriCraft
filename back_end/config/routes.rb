Rails.application.routes.draw do
  namespace :api, format: 'json' do
    namespace :v1 do
      get 'rhyme_search', to: 'rhyme_search#search'
      resource :profile, only: [:show]
      resource :registration, only: %i[create]
      resource :authentication, only: %i[create destroy]

      namespace :user do
        resources :notes, only: %i[index create show update destroy] do
          get :exists, on: :collection
        end
      end
    end
  end
end