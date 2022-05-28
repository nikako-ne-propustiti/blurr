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
    following = Follow.where(follower_id: current_user).pluck(:followee_id)
    # If no followers, return empty. Frontend will call suggestions
    if following.size == 0
      render json: {
        success: true,
        posts: [],
        left: 0
      }
      return
    end

    posts_number = last_index == 0 ? 5 : 10;
    posts = Post.where('user_id in (?)', following).order(created_at: :desc).offset(last_index).limit(posts_number)
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
  # Returns up to 10 suggestions for accounts to follow
  # Sorted descending by follower count
  def suggestions

    accounts = User.find_by_sql("select * from users join (
      select users.id from
      users join follows on follows.follower_id = users.id
      group by follower_id, users.id
      order by count(*) desc) f on f.id = users.id;").limit(10)

    render json: {
      success: true,
      suggestions: accounts.map { |a| a.get_json current_user },
    }
  end
end