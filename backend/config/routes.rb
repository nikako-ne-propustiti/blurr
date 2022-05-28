Rails.application.routes.draw do
  post '/api/accounts/login', to: 'accounts#login'
  delete '/api/accounts/logout', to: 'accounts#logout'
  post '/api/accounts/register', to: 'accounts#register'
  post '/api/users/follow', to: 'users#follow'
  get '/api/users/info', to: 'users#info'
  get '/api/posts/suggestions', to: 'posts#suggestions'
  get '/api/posts/', to: 'posts#posts'
  get '/api/review', to: 'review#get'
  post '/api/review/:postId', to: 'review#submit'
  post '/api/p/new', to: 'posts#new'
  post '/api/users/pfp', to: 'users#pfp'
end
