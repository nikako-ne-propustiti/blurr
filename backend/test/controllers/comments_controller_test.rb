require "test_helper"

class CommentsControllerTest < ActionDispatch::IntegrationTest

  test "guest comments unsuccessfully" do
    post "/api/comments/#{get_reviewed_post.id}"
    assert_require_login
  end

  test "guest toggles like unsuccessfully" do
    post "/api/comments/#{get_comment.id}/likes"
    assert_require_login
  end

  test "regular user comments unsuccessfully missing params" do
    login_regular_user
    post "/api/comments/#{get_reviewed_post.id}"
    assert_missing_param
  end

  test "regular user comments successfully" do
    login_regular_user
    post "/api/comments/#{get_reviewed_post.id}", params: {
      comment: {
        text: 'test',
        time: nil,
        parent_comment_id: nil
      }
    }, as: :json
    db_comment = Comment.find_by(comment_text: 'test')
    test_comment = {
      id: db_comment[:id],
      postId: get_reviewed_post.id,
      parentCommentId: nil,
      text: 'test',
      likes: 0,
      time: db_comment[:created_at],
      commenter: {
        id: 336453508,
        username: 'testuser1',
        realName: 'Test User1',
        profileURL: 'testuser1',
        profilePhotoURL: '/default-images/default_user.jpg',
        amFollowing: false,
        numberOfPosts: 2,
        numberOfFollowers: 0,
        numberFollowing: 0
      },
      haveLiked: false
    }
    assert_request body: {
      success: true,
      comment: test_comment,
    }
  end

  test "regular user likes and then unlikes a comment successfully" do
    login_regular_user
    post "/api/comments/#{get_comment.id}/likes"
    assert_request body: {
      success: true,
      haveLiked: true
    }
    assert CommentLike.exists?(user_id: get_regular_user.id, comment_id: get_comment.id)
    post "/api/comments/#{get_comment.id}/likes"
    assert_request body: {
      success: true,
      haveLiked: false
    }
    assert !CommentLike.exists?(user_id: get_regular_user.id, comment_id: get_comment.id)
  end
end
