# Superclass of all other controllers, used for utilities shared between them.
class ApplicationController < ActionController::API
  include ActionController::Cookies

  # Catches situations when inserting a resource which already exists.
  # These are usually caused by invalid user input.
  rescue_from ActiveRecord::RecordNotUnique do |exception|
    render json: {success: false, error: 'Already exists.'}
  end

  # Catches situations when a required parameter field is missing.
  # These are usually caused by invalid API calls.
  rescue_from ActionController::ParameterMissing do |exception|
    render json: {success: false, error: 'Missing required fields.'}
  end

  # Catches situations when a requested resource does not exist in the
  # database.
  # These are usually caused by invalid user input.
  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: {success: false, error: 'Requested resource does not exist.'}
  end

  private

  # Pre-request hook that checks whether the user is logged in,
  # controller-wide.
  # @return That the request failed due to not being logged in, or nil
  #         if the request should be passed to other controllers.
  def check_logged_in
    unless current_user
      render json: {success: false, error: 'You must be logged in to perform this action.'}, status: 401
    end
  end

  # Pre-request hook that checks whether the user is an administrator,
  # controller-wide.
  # @return That the request failed due to not being an administrator, or nil
  #         if the request should be passed to other controllers.
  def check_admin
    if not current_user or not current_user.is_admin
      render json: {success: false, error: 'This resource is admin-only.'}, status: 403
    end
  end

  # Accessor for the currently logged in user.
  # @return User object of the currently logged in user, or nil if not
  # logged in.
  def current_user
    @_current_user ||= session[:user_id] && User.find_by(id: session[:user_id])
  end
end
