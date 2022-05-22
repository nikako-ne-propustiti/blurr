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
    following = Follow.where follower_id: current_user
    if following.size == 0
      render json: {
        success: true,
        posts: [],
        left: 0
      }
      return
    end
    posts = Post.where('user_id in (?)', following).order(created_at: :desc).offset(last_index).limit(10)
    render json: {
      success: true,
      posts: posts.map { |p| p.get_json }
    }
  end

  ##
  # GET /api/accounts/suggestions
  #
  # Returns suggestions for accounts to follow
  def suggestions
    following = Follow.where(follower_id: current_user).pluck(:followee_id)
    if following
      accounts = User.where('id NOT IN (?)', following).limit(20)
    else
      accounts = User.where('id != ?', current_user.id).limit(20)
    end

    render json: {
      success: true,
      suggestions: accounts.map { |a| a.get_json current_user }
    }
  end
end