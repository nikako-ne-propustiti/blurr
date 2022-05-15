class Post < ApplicationRecord
  belongs_to :user

  def get_json(user)
    return {
      id: id,
      # TODO: Add photo fetching endpoint
      photoURL: 'https://picsum.photos/600',
      description: description,
      haveLiked: PostLike.exists?(user_id: user.id, post_id: id),
      time: created_at,
      poster: User.find_by(id: user_id).get_json(user),
      comments: Comment.where(post_id: id).map {|c| c.get_json(user) }
    }
  end
end
