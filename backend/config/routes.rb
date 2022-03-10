Rails.application.routes.draw do
  get 'greetings/hello'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/', to: 'static#index'
  get '/:username', to: 'static#index'
  get '/p/:post', to: 'static#index'
  get '/accounts/login', to: 'static#index'
  get '/accounts/edit', to: 'static#index'
end
