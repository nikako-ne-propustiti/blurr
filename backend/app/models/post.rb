class Post < ApplicationRecord
  belongs_to :user

  def get_json(user)
    unlocked = !user.nil? && (Unlock.exists?(user_id: user.id, post_id: id) || user.id == user_id)
    return {
      id: id,
      url: post_url,
      photoURL: unlocked ?
        "/images/#{file_uuid}#{password}.jpg" :
        "/images/#{file_uuid}.jpg",
      reviewPhotoURL: (!user.nil? && user.is_admin) ? "/images/#{file_uuid}#{password}.jpg" : false,
      description: description,
      haveLiked: !user.nil? && PostLike.exists?(user_id: user.id, post_id: id),
      followingWhoLiked: user.nil? ?
        [] :
        Follow
          .joins(follower: :post_likes)
          .where('post_likes.post_id' => id)
          .where('post_likes.user_id != ?', user.id)
          .distinct
          .pluck(:username),
      likes: PostLike.where(post_id: id).length,
      time: created_at,
      poster: User.find_by(id: user_id).get_json(user),
      comments: Comment.where(post_id: id).map { |c| c.get_json(user) },
      unlocked: unlocked
    }
  end

end
