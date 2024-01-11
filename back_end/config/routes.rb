Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'rhyme_search/search', to: 'rhyme_search#search'
      resources :notes, only: [:index, :create, :show, :update, :destroy]
    end
  end
end
