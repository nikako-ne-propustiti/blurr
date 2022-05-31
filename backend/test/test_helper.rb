ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  fixtures :all

  def assert_request(opts)
    assert_equal(@response.body, opts[:body].to_json)
    assert_equal(@response.status, (opts[:status] || 200))
  end

  def assert_already_exists
    assert_request body: {
      success: false,
      error: 'Already exists.'
    }, status: 400
  end

  def assert_missing_param
    assert_request body: {
      success: false,
      error: 'Missing required fields.'
    }, status: 400
  end

  def assert_not_found
    assert_request body: {
      success: false,
      error: 'Requested resource does not exist.'
    }, status: 404
  end

  def get_admin_user
    return users(:testuser2)
  end

  def login_admin_user
    user = get_admin_user
    post api_accounts_login_path, params: {
      username: user.username,
      password: '123'
    }
    assert_equal session[:user_id], user.id
    assert_request body: {
      success: true,
      isAdmin: true
    }
  end
end
