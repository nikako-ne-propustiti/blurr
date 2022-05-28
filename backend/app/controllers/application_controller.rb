class ApplicationController < ActionController::API
  include ActionController::Cookies

  rescue_from ActiveRecord::RecordNotUnique do |exception|
    render json: {success: false, error: 'Already exists.'}
  end

  rescue_from ActionController::ParameterMissing do |exception|
    render json: {success: false, error: 'Missing required fields.'}
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: {success: false, error: 'Requested resource does not exist.'}
  end

  private

  def check_logged_in
    unless current_user
      render json: {success: false, error: 'You must be logged in to perform this action.'}, status: 401
    end
  end

  def check_admin
    if not current_user or not current_user.is_admin
      render json: {success: false, error: 'This resource is admin-only.'}, status: 403
    end
  end

  def current_user
    @_current_user ||= session[:user_id] && User.find_by(id: session[:user_id])
  end
end
