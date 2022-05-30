# Handles post-related API requests.
#
# Requires authentication before use, unless requesting a single post or
# a user's post feed.
class PostsController < ApplicationController
  before_action :check_logged_in, except: [:get, :posts]

  # GET /api/posts/:postId
  #
  # Retrieves information about a single post.
  # @param postId [string] URL segment of the post requested
  # @returns Post data
  def get
    post = Post.find_by(post_url: params.require(:postId))
    render json: {
      post: post.get_json(current_user),
      success: true
    }
  end

  # DELETE /api/posts/:postId
  #
  # Deletes the specified post.
  # @param postId [number] ID of the post to delete
  # @returns That the request suceeded, unless the user requesting deletion
  #          is not the post author
  def delete
    post = Post.find(params.require(:postId))
    if post.user_id == current_user.id
      post.destroy
      render json: {
        success: true
      }
    else
      render json: {
        success: false,
        error: 'You do not have the permission to perform this action.'
      }, status: 403
    end
  end

  # POST /api/posts/:postId/likes
  #
  # Likes or unlikes a post, depending on whether it was already liked.
  # @param postId [int] ID of the post to like or unlike
  # @return That the request succeeded, and the current like status
  def toggle_like
    post_like = PostLike.find_by(user_id: current_user.id, post_id: params.require(:postId))
    if post_like
      post_like.destroy
      render json: {
        success: true,
        haveLiked: false
      }
    else
      PostLike.create(user_id: current_user.id, post_id: params.require(:postId))
      render json: {
        success: true,
        haveLiked: true
      }
    end
  end

  # GET /api/posts
  #
  # Retrieves posts for the user's feed. If a username is specified, lists all
  # posts from a specified user, otherwise lists posts from users that the
  # current user is following.
  # @param username [string|nil] Username of the user whose feed is being
  #                              fetched
  # @param lastIndex [int] Last post's index received from the previous query,
  #                        used for pagination
  # @return List of posts filtered by specified criteria.
  def posts
    last_index = params.require(:lastIndex).to_i
    username = params[:username]
    posts = []
    posts_number = 10
    if username != ''
      user = User.find_by username: username
      posts = Post.where(user_id: user.id).offset(last_index).limit(posts_number)
    else
      following = Follow.where(follower_id: current_user).pluck(:followee_id)
      # If no followers, return empty. Frontend will call suggestions
      if following.size == 0
        render json: {
          success: true,
          posts: [],
          left: 0
        }
        return
      end
      posts_number = 5 if last_index == 0
      posts = Post.where('user_id in (?)', following).order(created_at: :desc).offset(last_index).limit(posts_number)
      post_count = Post.where('user_id in (?)', following).count
    end
    render json: {
      success: true,
      posts: posts.map { |p| p.get_json current_user }
    }
  end

  # GET /api/posts/suggestions
  #
  # Returns up to 10 suggestions for accounts to follow, sorted descending
  # by follower count.
  # @return Suggested accounts
  def suggestions
    accounts = User.find_by_sql(["
      SELECT *
      FROM users JOIN (
        SELECT users.id
        FROM users JOIN follows ON follows.followee_id = users.id
        GROUP BY followee_id, users.id
        ORDER BY COUNT(*) DESC)
       f ON f.id = users.id
       WHERE users.id != ?
       LIMIT 10", current_user.id])

    render json: {
      success: true,
      suggestions: accounts.map { |a| a.get_json current_user },
    }
  end

  # POST /api/posts
  #
  # Creates a new post.
  # @param image [File] Uploaded image
  # @param password [string] Password for the image
  # @param blur-level [number] Blur level (multiplied by 5 before sent to
  #                            ImageMagick)
  # @param description [string] Post description
  # @return New post's URL segment.
  def new
    image = params.require(:image)
    password = params.require(:password)
    blur_level = params.require(:"blur-level").to_i
    description = params.require(:description)

    post = Post.new
    post.password = password

    loop do
      url = SecureRandom.hex(8)
      if not Post.find_by(post_url: url)
        post.post_url = url
        break
      end
    end

    post.file_uuid = SecureRandom.uuid
    post.description = description
    post.user_id = current_user.id

    if not post.valid?
      render json: { success: false, error: post.errors.full_messages[0] }, status: 400
      return
    end

    File.binwrite("public/images/#{post.file_uuid}#{password}.jpg", image.read)
    imageLocked = MiniMagick::Image.open("public/images/#{post.file_uuid}#{password}.jpg")

    imageLocked.combine_options do |i|
      i.blur "0x#{blur_level * 5}"
    end

    imageLocked.write "public/images/#{post.file_uuid}.jpg"

    post.save

    render json: {
      success: true,
      url: post.post_url
    }
  end
end
