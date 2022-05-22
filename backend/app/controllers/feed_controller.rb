class FeedController < ApplicationController
  before_action :check_logged_in
  ##
  # GET /api/posts/feed
  # Query:
  # username - username
  #
  # Returns posts to form the user's feed
  # Posts are from profiles that the user follows
  def feed

  end

  ##
  # GET /api/accounts/suggestions
  # Query:
  # username - username
  #
  # Returns suggestions for accounts to follow
  def suggestions

  end
end