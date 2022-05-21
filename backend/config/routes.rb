Rails.application.routes.draw do
  post '/api/accounts/login', to: 'accounts#login'
  delete '/api/accounts/logout', to: 'accounts#logout'
  post '/api/accounts/register', to: 'accounts#register'
  post 'api/accounts/follow', to: 'follow#follow'
  get 'api/accounts/info', to: 'accounts#info'
  get '/api/accounts/posts', to: 'accounts#index'
  get '/api/review', to: 'review#get'
  post '/api/review/:postId', to: 'review#submit'
end
