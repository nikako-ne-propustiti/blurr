class PostsController < ApplicationController
  before_action :check_logged_in

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
end
