Rails.application.routes.draw do
  namespace :api, format: 'json' do
    namespace :v1 do
      get 'rhyme_search/search', to: 'rhyme_search#search'
      resource :registration, only: %i[create]
      resource :authentication, only: %i[create]
      resources :notes, only: [:index, :create, :show, :update, :destroy]
    end
  end
end
