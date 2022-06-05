require "test_helper"

class ReviewControllerTest < ActionDispatch::IntegrationTest
  test "get only unreviewed posts" do
    login_admin_user
    get api_review_path

    db_post = Post.find_by(post_url: 'url1')
    test_post = {
      id: db_post[:id],
      url: 'url1',
      photoURL: '/images/285b9102-fb53-4f9b-9c6a-46198c689825.jpg',
      reviewPhotoURL: '/images/285b9102-fb53-4f9b-9c6a-46198c689825pass1.jpg',
      description: 'desc1',
      haveLiked: false,
      followingWhoLiked:[],
      likes: 0,
      time: db_post[:created_at],
      poster: {
        id: 336453508,
        username: 'testuser1',
        realName: 'Test User1',
        profileURL: 'testuser1',
        profilePhotoURL: '/default_images/default_user.jpg',
        amFollowing: false,
        numberOfPosts: 2,
        numberOfFollowers: 0,
        numberFollowing: 0
      },
      comments: [],
      unlocked: false
    }

    assert_request body: {
      success: true,
      posts: [test_post]
    }
  end

  test "approve post" do
      login_admin_user
      post "/api/review/#{get_unreviewed_post.id}", params: {
        approve: true
      }
      assert_request body: {
        success: true,
      }
      approved_post = Post.find_by(id: get_unreviewed_post.id)

      assert_equal(approved_post.reviewed, true)
  end

  test "disapprove post" do
    login_admin_user
    post "/api/review/#{get_unreviewed_post.id}", params: {
      approve: false,
    }, as: :json
    assert_request body: {
      success: true,
    }
    disapproved_post = Post.find_by(id: get_unreviewed_post.id)

    assert_nil disapproved_post
  end

  test "regular user cannot review posts" do
    login_regular_user
    get api_review_path

    assert_require_admin
  end
end
