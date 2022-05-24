class FeedController < ApplicationController
  before_action :check_logged_in
  ##
  # GET /api/posts/feed
  # Query:
  # lastIndex - the last post's index received from the previous query
  #
  # Returns posts to form the user's feed
  # Posts are from profiles that the user follows
  def feed
    last_index = params.require(:lastIndex)
    following = Follow.where( follower_id: current_user).pluck(:followee_id)
    # If no followers, return empty. Frontend will call suggestions
    if following.size == 0
      render json: {
        success: true,
        posts: [],
        left: 0
      }
      return
    end

    posts = Post.where('user_id in (?)', following).order(created_at: :desc).offset(last_index).limit(10)
    left = posts.length >= 10 ? posts.length - 10 : 0

    render json: {
      success: true,
      posts: posts.map { |p| p.get_json current_user },
      left: left
    }
  end

  ##
  # GET /api/accounts/suggestions
  #
  # Returns suggestions for accounts to follow
  def suggestions
    following = Follow.where(follower_id: current_user).pluck(:followee_id)
    if following.size > 0
      # Suggesting who we are not following
      accounts = User.where('id NOT IN (?)', following).limit(20)
    else
      # Suggestions in general
      accounts = User.where('id != ?', current_user.id).limit(20)
    end

    render json: {
      success: true,
      suggestions: accounts.map { |a| a.get_json current_user }
    }
  end
end