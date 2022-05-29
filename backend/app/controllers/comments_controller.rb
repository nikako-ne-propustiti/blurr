class CommentsController < ApplicationController
  before_action :check_logged_in

  def submit
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

  def toggleLike
    commentLike = CommentLike.find_by(user_id: current_user.id, comment_id: params[:commentId])
    if commentLike
      commentLike.destroy
      render json: {
        success: true,
        haveLiked: false
      }
    else
      CommentLike.create(user_id: current_user.id, comment_id: params[:commentId])
      render json: {
        success: true,
        haveLiked: true
      }
    end
  end
end
