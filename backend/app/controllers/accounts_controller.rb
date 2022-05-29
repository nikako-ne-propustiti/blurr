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
    session[:user_id] = user.id
    render json: { success: true }
  end
end
