Rails.application.routes.draw do
  # Accounts API
  post    '/api/accounts/login',            to: 'accounts#login'
  delete  '/api/accounts/logout',           to: 'accounts#logout'
  post    '/api/accounts/register',         to: 'accounts#register'
  get     '/api/accounts/whoami',           to: 'accounts#info'
  # Users API
  post    '/api/users/:username/follow',    to: 'users#follow'
  get     '/api/users/:username',           to: 'users#info'
  patch   '/api/users',                     to: 'users#edit'
  post    '/api/users/pfp',                 to: 'users#pfp'
  get     '/api/users',                     to: 'users#search'
  # Posts API
  get     '/api/posts/suggestions',         to: 'posts#suggestions'
  get     '/api/posts',                     to: 'posts#posts'
  get     '/api/posts/:postId',             to: 'posts#get'
  post    '/api/posts',                     to: 'posts#new'
  delete  '/api/posts/:postId',             to: 'posts#delete'
  post    '/api/posts/:postId/likes',       to: 'posts#toggle_like'
  post    '/api/posts/:postId/unlock',      to: 'posts#unlock'
  # Comments API
  post    '/api/comments/:commentId/likes', to: 'comments#toggle_like'
  post    '/api/comments/:postId',          to: 'comments#new'
  # Review API
  get     '/api/review',                    to: 'review#get'
  post    '/api/review/:postId',            to: 'review#submit'
end
