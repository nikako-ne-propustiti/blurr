class ReviewController < ApplicationController
  before_action :check_admin
  def get
    unreviewed_posts = Post.where(reviewed: false)
    render json: {
      success: true,
      posts: unreviewed_posts.map {|p| p.get_json(current_user) }
    }
  end
  def submit
    post = Post.find(params[:postId])
    if params.require(:approve)
      post.reviewed = true
      post.save
    else
      post.destroy
    end
    render json: {success: true}
  end
end
