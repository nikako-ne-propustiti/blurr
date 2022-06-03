require "test_helper"

class ReviewControllerTest < ActionDispatch::IntegrationTest
  test "get only unreviewed posts" do
    login_admin_user
    get api_review_path

    db_post = Post.find_by(post_url: 'url1')
    test_post = {
      # Ignore
      id: db_post[:id],
      post_url: 'posturl',
      file_uuid: '285b9102-fb53-4f9b-9c6a-46198c689825',
      description: 'desc1',
      user_id: get_regular_user.id,
      # Ignore
      created_at: db_post[:created_at],
      password: '123',
      reviewed: false,
      sponsored: false,
    }

    assert_request body: {
      success: true,
      posts: [test_post.to_json]
    }
  end

  test "approve post" do
      login_admin_user
      post api_review_path(get_unreviewed_post.id), params: {
        approve: true
      }
      assert_request body: {
        success: true,
      }
      # TODO assert da je post.reviewed == true nakon ovoga
  end

  test "disapprove post" do
    login_admin_user
    post api_review_path(get_unreviewed_post.id)
    assert_request body: {
      success: true,
    }
    # TODO assert da je post izbrisan nakon ovoga
  end
end
