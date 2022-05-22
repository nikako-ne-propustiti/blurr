class FollowController < ApplicationController
  before_action :check_logged_in
  ##
  # POST api/accounts/follow
  # JSON:
  # username - username
  #
  # Follows/unfollows the account with the given username. The follower is the currently logged in account.
  def follow
    followee = User.find_by! username: params.require(:username)
    follower = User.find session[:user_id]
    if followee == follower
      render json: {
        success: false,
        following: false
      }
      return
    end
    following = Follow.find_by follower_id: follower.id, followee_id: followee.id
    if following
      following.destroy
      render json: {
        success: true,
        following: false
      }
    else
      following = Follow.create follower_id: follower.id, followee_id: followee.id
      render json: {
        success: true,
        following: true
      }
    end
  end
end
