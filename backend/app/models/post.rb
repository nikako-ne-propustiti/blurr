class Post < ApplicationRecord
  belongs_to :user

  def get_json(user)
    return {
      id: id,
      # TODO: Add photo fetching endpoint
      photoURL: 'https://picsum.photos/512/512?nocache=',
      description: description,
      haveLiked: PostLike.exists?(user_id: user.id, post_id: id),
      time: created_at,
      poster: User.find_by(id: user_id).get_json(user),
      #comments: Comment.where(post_id: id).map { |c| c.get_json(user) }
      comments: []
    }
  end

  def get_basic_json()
    return {
      id: id,
      # TODO: Add photo fetching endpoint for thumbnails
      photoURL: 'https://picsum.photos/512/512?nocache=',
      numberOfLikes: PostLike.where(post_id:id).count
    }
  end
end
