require "test_helper"

class AccountsControllerTest < ActionDispatch::IntegrationTest
  def assert_invalid_login
    assert_nil session[:user_id]
    assert_request body: {
      success: false,
      error: 'Invalid username or password.'
    }, status: 400
  end

  test "regular user login successful" do
    user = users(:testuser1)
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

  test "login missing params" do
    post api_accounts_login_path, params: {}
    assert_missing_param
    post api_accounts_login_path, params: {username: 'a'}
    assert_missing_param
    post api_accounts_login_path, params: {password: 'a'}
    assert_missing_param
  end

  test "login unsuccessful invalid username" do
    post api_accounts_login_path, params: {
      username: 'invaliduser1',
      password: '123'
    }
    assert_invalid_login
  end

  test "login unsuccessful invalid password" do
    user = users(:testuser1)
    post api_accounts_login_path, params: {
      username: user.username,
      password: 'invalidpassword1'
    }
    assert_invalid_login
  end

  test "whoami logged out" do
    get api_accounts_whoami_path
    assert_request body: {success: true}
  end

  test "whoami logged in" do
    user = users(:testuser1)
    post api_accounts_login_path, params: {
      username: user.username,
      password: '123'
    }
    get api_accounts_whoami_path
    assert_request body: {
      success: true,
      user: user.username,
      isAdmin: false
    }
  end

  test "register succesful" do
    post api_accounts_register_path, params: {
      username: 'abc',
      password: '123',
      name: 'ab cd'
    }
    assert session[:user_id] != nil
    assert_request body: {
      success: true,
    }
    assert User.exists?(username: 'abc')
  end

  test "register unsuccesful username exists" do
    post api_accounts_register_path, params: {
      username: 'testuser1',
      password: '123',
      name: 'ab cd'
    }
    assert_already_exists
  end

  test "register missing params" do
    post api_accounts_register_path, params: {}
    assert_missing_param
    post api_accounts_register_path, params: {username: 'a', password: 'b'}
    assert_missing_param
    post api_accounts_register_path, params: {name: 'a', password: 'b'}
    assert_missing_param
    post api_accounts_register_path, params: {username: 'a', name: 'b'}
    assert_missing_param
  end

  test "logout succesful" do
    delete api_accounts_logout_path
    assert_nil session[:user_id]
    assert_request body: {
      success: true,
    }
  end
end
