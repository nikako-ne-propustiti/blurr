class UsersController < ApplicationController
  before_action :check_logged_in, except: :info
  ##
  # GET api/users/{username}
  # Query parameters:
  # username - username
  #
  # Gets basic information about the user. This is used on individual account pages.
  def info
    username = params.require(:username)
    user = User.find_by! username: username
    info = user.get_json current_user
    if user
      render json: {
        success: true,
        account: info
      }
    end
  end

  ##
  # POST api/users/follow
  # JSON:
  # username - username
  #
  # Follows/unfollows the account with the given username. The follower is the currently logged in account.
  def follow
    followee = User.find_by! username: params.require(:username)
    follower = User.find session[:user_id]
    if followee == follower
      render json: {
        success: false,
        following: false
      }
      return
    end
    following = Follow.find_by follower_id: follower.id, followee_id: followee.id
    if following
      following.destroy
      render json: {
        success: true,
        following: false
      }
    else
      following = Follow.create follower_id: follower.id, followee_id: followee.id
      render json: {
        success: true,
        following: true
      }
    end
  end

  ##
  # POST /api/users/pfp
  #
  # Sets a new profile photo for the user.
  # Profile photos must meet the following criteria:
  # JPEG format
  # max resolution 512x512
  # min resolution 150x150
  # max size 2 MB
  def pfp
    user = User.find session[:user_id]
    image = params.require(:image)

    old_uuid = user.profile_photo_uuid
    uuid =  SecureRandom.uuid

    File.binwrite("public/images/pfp/#{uuid}.jpg", image.read)
    image = MiniMagick::Image.open("public/images/pfp/#{uuid}.jpg")
    if image.type != 'JPEG'
      File.delete "public/images/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'Image must be in JPEG format.' }, status: 400
      return
    elsif image.size > 2048 * 1000
      File.delete "public/images/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'Image larger than 2 MB.' }, status: 400
      return
    elsif image.width > 512 || image.width < 150 || image.height > 512 || image.width < 150
      File.delete "public/images/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'Image too big or too small.' }, status: 400
      return
    elsif not user.valid?
      File.delete "public/images/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'User error.' }, status: 400
      return
    end
    File.delete"public/images/pfp/#{old_uuid}.jpg"
    user.profile_photo_uuid = uuid
    user.save
    render json: {
      success: true,
    }
  end
end
