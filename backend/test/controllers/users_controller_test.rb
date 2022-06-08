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

  test "cannot change profile picture when logged out" do
    post "/api/users/pfp"
    assert_require_login
  end

  test "cannot change profile picture missing params" do
    login_user3
    post "/api/users/pfp"
    assert_missing_param
  end

  test "cannot change profile picture wrong dimensions" do
    login_user3
    post "/api/users/pfp", params: {
      image: fixture_file_upload('pfp-invalid-format.png')
    }
    assert_request body: {
      success: false, error: 'Image must be in JPEG format.'
    }, status: 400

    post "/api/users/pfp", params: {
      image: fixture_file_upload('pfp-not-tall-enough.jpg')
    }
    assert_request body: {
      success: false, error: 'Image too big or too small.'
    }, status: 400

    post "/api/users/pfp", params: {
      image: fixture_file_upload('pfp-not-wide-enough.jpg')
    }
    assert_request body: {
      success: false, error: 'Image too big or too small.'
    }, status: 400

    post "/api/users/pfp", params: {
      image: fixture_file_upload('pfp-too-tall.jpg')
    }
    assert_request body: {
      success: false, error: 'Image too big or too small.'
    }, status: 400

    post "/api/users/pfp", params: {
      image: fixture_file_upload('pfp-too-wide.jpg')
    }
    assert_request body: {
      success: false, error: 'Image too big or too small.'
    }, status: 400
  end

  test "profile picture update successful" do
    login_user3
    SecureRandom.stub :uuid, '285b9102-fb53-4f9b-9c6a-46198c689825' do
      post "/api/users/pfp", params: {
        image: fixture_file_upload('pfp-valid.jpg')
      }
    end
    assert_request body: {
      success: true, url: "/pfp/285b9102-fb53-4f9b-9c6a-46198c689825.jpg"
    }
  end

  test "cannot edit real name when logged out" do
    patch "/api/users"
    assert_require_login
  end

  test "cannot edit real name missing params" do
    login_user3
    patch "/api/users"
    assert_missing_param
  end

  test "edit real name successfully" do
    login_user3
    patch "/api/users", params: {
      realName: 'Check Test Name'
    }
    assert_request body: {
      success: true
    }
    db_user = User.find_by! username: get_user3.username
    assert db_user.real_name == 'Check Test Name'
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
        profilePhotoURL: "/default-images/default_user.jpg",
        amFollowing: false,
        numberOfPosts: 1,
        numberOfFollowers: 0,
        numberFollowing: 1,
      }
    }
  end
end
