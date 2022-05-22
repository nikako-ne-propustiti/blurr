Rails.application.routes.draw do
  post '/api/accounts/login', to: 'accounts#login'
  delete '/api/accounts/logout', to: 'accounts#logout'
  post '/api/accounts/register', to: 'accounts#register'
  post '/api/accounts/follow', to: 'follow#follow'
  get '/api/accounts/info', to: 'accounts#info'
  get '/api/accounts/posts', to: 'accounts#index'
  get '/api/accounts/suggestions', to: 'feed#suggestions'
  post '/api/accounts/pfp', to: 'profilephoto#pfp'
  get '/api/posts', to: 'posts#index'
  get '/api/posts/feed', to: 'feed#feed'
  get '/api/review', to: 'review#get'
  post '/api/review/:postId', to: 'review#submit'
end
