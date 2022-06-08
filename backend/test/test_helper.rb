ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/mock'

class ActiveSupport::TestCase
  fixtures :all

  def assert_request(opts)
    assert_equal(opts[:body].to_json, @response.body)
    assert_equal((opts[:status] || 200), @response.status)
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

  def assert_require_login
    assert_request body: {
      success: false,
      error: 'You must be logged in to perform this action.'
    }, status: 401
  end

  def assert_require_admin
    assert_request body: {
      success: false,
      error: 'This resource is admin-only.'
    }, status: 403
  end

  def assert_no_permission
    assert_request body: {
      success: false,
      error: 'You do not have the permission to perform this action.'
    }, status: 403
  end

  def get_unreviewed_post
    return posts(:testpost1)
  end

  def get_reviewed_post
    return posts(:testpost2)
  end

  def get_post_to_delete
    return posts(:testpost3)
  end

  def get_regular_user
    return users(:testuser1)
  end

  def get_admin_user
    return users(:testuser2)
  end

  def get_user3
    return users(:testuser3)
  end

  def get_user4
    return users(:testuser4)
  end

  def get_comment
    return comments(:testcomment1)
  end

  def login_regular_user
    user = get_regular_user
    post api_accounts_login_path, params: {
      username: user.username,
      password: '123'
    }
    assert_equal session[:user_id], user.id
    assert_request body: {
      success: true,
      isAdmin: false
    }
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

  def login_user3
    user = get_user3
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

  def login_user4
    user = get_user3
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
