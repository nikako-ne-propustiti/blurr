class UsersController < ApplicationController
  before_action :check_logged_in, except: :info
  ##
  # GET api/users/{username}
  # Query parameters:
  # username - username
  #
  # Gets basic information about the user. This is used on individual account pages.
  def info
    username = params.require(:username)
    user = User.find_by! username: username
    info = user.get_json current_user
    if user
      render json: {
        success: true,
        account: info
      }
    end
  end

  ##
  # POST api/users/follow
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
