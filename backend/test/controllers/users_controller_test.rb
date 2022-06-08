require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "cannot follow when logged out" do
    post "/api/users/#{get_user3.username}/follow"
    assert_require_login
  end

  test "cannot follow non-existing user" do
    login_user3
    post "/api/users/testusername/follow"
    assert_not_found
  end

  test "cannot follow yourself" do
    login_user3
    post "/api/users/#{get_user3.username}/follow"
    assert_request body: {
      success: false,
      error: 'You cannot follow yourself.',
      following: false
    }, status: 400
  end

  test "follow and unfollow successful" do
    login_user3
    post "/api/users/#{get_user4.username}/follow"
    assert_request body: {
      success: true,
      following: false
    }
    assert !Follow.exists?(follower_id: get_user3.id, followee_id: get_user4.id)
    post "/api/users/#{get_user4.username}/follow"
    assert_request body: {
      success: true,
      following: true
    }
    assert Follow.exists?(follower_id: get_user3.id, followee_id: get_user4.id)
  end

  test "get account info unsuccessful non-existing user" do
    get "/api/users/nonexisting"
    assert_not_found
  end

  test "get account info successfully" do
    get "/api/users/#{get_user3.username}"
    assert_request body: {
      success: true,
      account: {
        id: get_user3.id,
        username: "testuser3",
        realName: "Test User3",
        profileURL: "testuser3",
        profilePhotoURL: "/default_images/default_user.jpg",
        amFollowing: false,
        numberOfPosts: 1,
        numberOfFollowers: 0,
        numberFollowing: 1,
      }
    }
  end
end
