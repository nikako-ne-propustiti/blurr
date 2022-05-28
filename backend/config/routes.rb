Rails.application.routes.draw do
  post '/api/accounts/login', to: 'accounts#login'
  delete '/api/accounts/logout', to: 'accounts#logout'
  post '/api/accounts/register', to: 'accounts#register'
  get '/api/review', to: 'review#get'
  post '/api/review/:postId', to: 'review#submit'
  get '/api/posts/:postId', to: 'posts#get'
  post '/api/posts', to: 'posts#submit'
  delete '/api/posts/:postId', to: 'posts#delete'
  post '/api/posts/:postId/likes', to: 'posts#toggleLike'
  post '/api/comments/:commentId/likes', to: 'comments#toggleLike'
  post '/api/comments/:postId', to: 'comments#submit'
  post '/api/comments/:postId/:commentId', to: 'comments#reply'
end
