Rails.application.routes.draw do
  namespace :api, format: 'json' do
    namespace :v1 do
      get 'rhyme_search', to: 'rhyme_search#search'
      resource :profile, only: [:show]
      resource :registration, only: %i[create]
      resource :authentication, only: %i[create destroy] do
        post 'google_create', on: :collection 
      end

      namespace :user do
        resources :notes, only: %i[index create show update destroy]
      end
    end
  end
end