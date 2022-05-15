Rails.application.routes.draw do
  post '/api/accounts/login', to: 'accounts#login'
  delete '/api/accounts/logout', to: 'accounts#logout'
  post '/api/accounts/register', to: 'accounts#register'
  get '/api/review', to: 'review#get'
  post '/api/review/:postId', to: 'review#submit'
end
