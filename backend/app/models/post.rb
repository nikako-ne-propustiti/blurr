class Post < ApplicationRecord
  belongs_to :user

  def get_json(user)
    return {
      id: id,
      url: post_url,
      photoURL: "/images/#{file_uuid}.jpg",
      description: description,
      haveLiked: PostLike.exists?(user_id: user.id, post_id: id),
      likes: PostLike.where(post_id: id).length,
      time: created_at,
      poster: User.find_by(id: user_id).get_json(user),
      comments: Comment.where(post_id: id).map { |c| c.get_json(user) }
    }
  end

end
