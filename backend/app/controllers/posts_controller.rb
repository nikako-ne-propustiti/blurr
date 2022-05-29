class PostsController < ApplicationController
  before_action :check_logged_in, except: :posts

  def get
    post = Post.find(params[:postId])
    if post
      render json: {
        post: post.get_json(current_user),
        success: true
      }
    else
      render json: {
        success: false
      }
    end
  end

  def delete
    post = Post.find(params[:postId])
    if post.user_id == current_user.id
      post.destroy
      render json: {
        success: true,
      }
    else
      render json: {
        success: false,
      }, status: 403
    end
  end

  def toggleLike
    postLike = PostLike.find_by(user_id: current_user.id, post_id: params[:postId])
    if postLike
      postLike.destroy
      render json: {
        success: true,
        haveLiked: false
      }
    else
      PostLike.create(user_id: current_user.id, post_id: params[:postId])
      render json: {
        success: true,
        haveLiked: true
      }
    end
  end

  ##
  # GET /api/posts/
  # Query:
  # username - username
  # lastIndex - the last post's index received from the previous query
  #
  # Returns posts to form the user's feed
  # Posts are from profiles that the user follows
  # If username is specified, returns only posts from that user
  def posts
    last_index = params.require(:lastIndex)
    username = params[:username]
    posts = []
    if username != ''
      user = User.find_by username: params.require(:username)
      posts = Post.where(user_id: user.id).offset(last_index).limit(10)
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
      posts_number = last_index == 0 ? 5 : 10;
      posts = Post.where('user_id in (?)', following).order(created_at: :desc).offset(last_index).limit(posts_number)
    end
    left = posts.length >= 10 ? posts.length - 10 : 0
    render json: {
      success: true,
      posts: posts.map { |p| p.get_json current_user },
      left: left
    }
  end

  ##
  # GET /api/posts/suggestions
  #
  # Returns up to 10 suggestions for accounts to follow
  # Sorted descending by follower count
  def suggestions

    accounts = User.find_by_sql("select * from users join (
      select users.id from
      users join follows on follows.follower_id = users.id
      group by follower_id, users.id
      order by count(*) desc) f on f.id = users.id
      limit 10;")

    render json: {
      success: true,
      suggestions: accounts.map { |a| a.get_json current_user },
    }
  end

  ##
  # POST /api/p/new
  #
  # Creates a new post
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

