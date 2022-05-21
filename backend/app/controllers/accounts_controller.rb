class AccountsController < ApplicationController
  def login
    user = User.find_by(username: params.require(:username))
    if not user or not user.authenticate(params.require(:password))
      render json: { success: false, error: 'Invalid username or password.' }, status: 400
      return
    end
    session[:user_id] = user.id
    render json: { success: true }
  end

  def logout
    session.delete(:user_id)
    @_current_user = nil
    render json: { success: true }
  end

  def register
    username = params.require(:username)
    password = params.require(:password)
    real_name = params.require(:name)
    user = User.new(username: username, password: password, real_name: real_name)
    if not user.valid?
      render json: { success: false, error: user.errors.full_messages[0] }, status: 400
      return
    end
    user.save
    render json: { success: true }
  end

  before_action :check_logged_in

  def follow
    followed = User.find_by! username: params.require(:username)
    followee = User.find! session[:user_id]
    following = Follow.find_by follower_id: follower.id, followee_id: followee.id
    if following
      following.destroy
      return json: {
        success: true,
        following: false
      }
    else
      following = Follow.new follower_id: follower.id, followee_id: followee.id
      following.save
      return json: {
        success: true,
        following: true
      }
    end
  rescue => RecordNotFound
    return json: {
      success: false,
      following: false
    }
  end
end
