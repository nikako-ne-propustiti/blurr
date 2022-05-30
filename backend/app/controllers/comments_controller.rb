# Handles comment-related API requests.
#
# Requires authentication before use.
class CommentsController < ApplicationController
  before_action :check_logged_in

  # POST /api/comments/:postId
  #
  # Creates a new comment on a specified post.
  # @param comment [Hash] Comment data
  # @param comment.text [string] Comment body
  # @param comment.time [string] Date of posting
  # @param comment.parentCommentId [int|nil] Which comment is the current
  #                                          comment replying to
  # @param postId [int] Which post to create the comment on
  # @return That the request succeeded, and the comment created
  def new
    comment = params.require(:comment)
    post_id = params.require(:postId)

    c = Comment.create(
      comment_text: comment['text'],
      post_id: post_id,
      user_id: current_user.id,
      created_at: comment['time'],
      parent_comment_id: comment['parentCommentId']
    )

    render json: {
      success: true,
      comment: c.get_json(current_user)
    }
  end

  # POST /api/comments/:commentId/likes
  #
  # Likes or unlikes a comment, depending on whether it was already liked.
  # @param commentId [int] ID of the comment to like or unlike
  # @return That the request succeeded, and the current like status
  def toggle_like
    comment_like = CommentLike.find_by(user_id: current_user.id, comment_id: params.require(:commentId))
    if comment_like
      comment_like.destroy
      render json: {
        success: true,
        haveLiked: false
      }
    else
      CommentLike.create(user_id: current_user.id, comment_id: params.require(:commentId))
      render json: {
        success: true,
        haveLiked: true
      }
    end
  end
end
