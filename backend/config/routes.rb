Rails.application.routes.draw do
  get '/', to: 'static#index'
  get '/:username', to: 'static#index'
  get '/p/:post', to: 'static#index'
  get '/accounts/login', to: 'static#index'
  get '/accounts/edit', to: 'static#index'
  post '/api/accounts/login', to: 'accounts#login'
  post '/api/accounts/register', to: 'accounts#register'
  get '/api/review', to: 'review#get'
  post '/api/review/:postId', to: 'review#submit'
end
