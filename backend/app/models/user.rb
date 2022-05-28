class User < ApplicationRecord
  validates :username, presence: true, length: { minimum: 1, maximum: 30 }
  validates :real_name, presence: true, length: { minimum: 1, maximum: 255 }
  validates :password_digest, presence: true, length: { minimum: 1, maximum: 255 }

  has_secure_password validations: false

  def get_json(user)
    return {
      id: id,
      username: username,
      realName: real_name,
      profileURL: username,
      # TODO: Add profile photo fetching endpoint
      profilePhotoURL: 'https://picsum.photos/600',
      amFollowing: Follow.exists?(follower_id: user.id, followee_id: id),
      numberOfPosts: Post.where(user_id: id).count,
      numberOfFollowers: Follow.where(followee_id: id).count,
      numberFollowing: Follow.where(follower_id: id).count
    }
  end
end
