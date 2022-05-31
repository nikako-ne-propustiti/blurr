class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :parent_comment, optional: true
  belongs_to :user

  def get_json(user)
    has_commenter_unlocked = Unlock.exists?(user_id: user_id, post_id: post_id)
    has_current_user_unlocked = !user.nil? && Unlock.exists?(user_id: user.id, post_id: post_id)
    censored = has_commenter_unlocked && !has_current_user_unlocked
    return {
      id: id,
      postId: post_id,
      parentCommentId: parent_comment_id,
      text: censored ? '***' : comment_text,
      likes: CommentLike.where(comment_id: id).length,
      time: created_at,
      commenter: User.find_by(id: user_id).get_json(user),
      haveLiked: !user.nil? && CommentLike.exists?(user_id: user.id, comment_id: id)
    }
  end
end
