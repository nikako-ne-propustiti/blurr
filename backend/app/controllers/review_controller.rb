# Handles post review-related API requests.
#
# Requires that the user is an administrator before requesting.
class ReviewController < ApplicationController
  before_action :check_admin

  # GET /api/review
  #
  # Gets all posts for review.
  # @return All unreviewed posts
  def get
    unreviewed_posts = Post.where(reviewed: false)
    render json: {
      success: true,
      posts: unreviewed_posts.map {|p| p.get_json(current_user) }
    }
  end

  # POST /api/review/:postId
  #
  # Reviews a post, either approving or rejecting (deleting) it.
  # @param postId [int] ID of the post to review
  # @param approve [bool] Whether the post should be approved
  # @return That the request succeeded
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
