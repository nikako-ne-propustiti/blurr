# Handles authentication-related API requests.
class AccountsController < ApplicationController
  # POST /api/accounts/login
  #
  # Logs the user in if username and password match the data in the database.
  # @param username [string] Supplied username
  # @param password [string] Supplied password
  # @return Whether the request succeeded, and whether the user is an
  #         administrator
  def login
    user = User.find_by(username: params.require(:username))
    if not user or not user.authenticate(params.require(:password))
      render json: { success: false, error: 'Invalid username or password.' }, status: 400
      return
    end
    session[:user_id] = user.id
    render json: { success: true, isAdmin: user.is_admin }
  end

  # DELETE /api/accounts/logout
  #
  # Logs the user out.
  # @return That the request succeeded
  def logout
    session.delete(:user_id)
    @_current_user = nil
    render json: { success: true }
  end

  # POST /api/accounts/register
  #
  # Creates a new user account and logs the user in.
  # @param username [string] New user's username
  # @param password [string] New user's password
  # @param name [string] New user's real name
  # @return Whether the request succeeded
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

  # GET /api/accounts/whoami
  #
  # Gets information about the current user, in case they <s>have an
  # existential crisis</s> reload the page.
  # @returns That the request suceeded, user's username (if logged in) and
  #          whether they are an administrator
  def info
    if current_user.nil?
      render json: {
        success: true
      }
    else
      render json: {
        success: true,
        user: current_user.username,
        isAdmin: current_user.is_admin
      }
    end
  end
end
