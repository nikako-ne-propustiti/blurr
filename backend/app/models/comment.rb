class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :parent_comment, optional: true
  belongs_to :user

  def get_json(user)
    return {
      id: id,
      postId: post_id,
      parentCommentId: parent_comment_id,
      text: comment_text,
      likes: CommentLike.where(comment_id: id).length,
      time: created_at,
      commenter: User.find_by(id: user_id).get_json(user),
      haveLiked: CommentLike.exists?(user_id: user.id, comment_id: id)
    }
  end
end
