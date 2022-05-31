# Handles user-related API requests
#
# Requires authentication before use, unless requesting a single user's
# profile information, or searching for users.
class UsersController < ApplicationController
  before_action :check_logged_in, except: [:info, :search]

  # GET /api/users/:username
  #
  # Gets basic information about a user, to be shown on their profile page.
  # @param username [string] Username of the user requested
  # @return User's profile information
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

  # POST /api/users/:username/follow
  #
  # Follows or unfollows the account with the given username, depending on
  # whether the user is currently being followed.
  # @param username [string] Username of the user to follow/unfollow
  # @return Whether the account is currently being followed, or an error if the
  #         user is trying to follow themselves.
  def follow
    followee = User.find_by! username: params.require(:username)
    if followee == current_user
      render json: {
        success: false,
        error: 'You cannot follow yourself.',
        following: false
      }, status: 400
      return
    end
    following = Follow.find_by follower_id: current_user.id, followee_id: followee.id
    if following
      following.destroy
      render json: {
        success: true,
        following: false
      }
    else
      following = Follow.create follower_id: current_user.id, followee_id: followee.id
      render json: {
        success: true,
        following: true
      }
    end
  end

  # POST /api/users/pfp
  #
  # Sets a new profile photo for the current user.
  # Profile photos must meet the following criteria:
  # - JPEG format
  # - max resolution 512x512
  # - min resolution 150x150
  # - max size 2 MiB
  # @param image [File] Image to use as a profile picture
  # @return Whether the request succeeded, and the new profile picture's URL
  def pfp
    image = params.require(:image)

    old_uuid = current_user.profile_photo_uuid
    uuid =  SecureRandom.uuid

    unless File.directory?('public/pfp')
      FileUtils.mkdir_p('public/pfp')
    end
    File.binwrite("public/pfp/#{uuid}.jpg", image.read)
    image = MiniMagick::Image.open("public/pfp/#{uuid}.jpg")
    if image.type != 'JPEG'
      File.delete "public/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'Image must be in JPEG format.' }, status: 400
      return
    elsif image.size > 2048 * 1024
      File.delete "public/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'Image larger than 2 MB.' }, status: 400
      return
    elsif image.width > 512 || image.width < 150 || image.height > 512 || image.width < 150
      File.delete "public/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'Image too big or too small.' }, status: 400
      return
    elsif not current_user.valid?
      File.delete "public/pfp/#{uuid}.jpg"
      render json: { success: false, error: 'User error.' }, status: 400
      return
    end
    unless old_uuid.nil?
      File.delete "public/pfp/#{old_uuid}.jpg"
    end
    current_user.profile_photo_uuid = uuid
    current_user.save
    render json: {
      success: true,
      url: "/pfp/#{uuid}.jpg"
    }
  end

  # PATCH /api/users
  #
  # Edits properties of the current user. Currently, only the user's real name
  # is available for editing.
  # @param realName [string] User's new real name
  # @return That the request succeeded
  def edit
    current_user.real_name = params.require(:realName)
    current_user.save
    render json: {success: true}
  end

  # GET /api/users
  #
  # Searches for users with a specified search string in their username.
  # @param query [string] String to search for in the username
  # @return Search results
  def search
    query = params.require(:query)
    render json: {
      success: true,
      users: User
        .where("username ~* ?", query)
        .limit(5)
        .map {|u| u.get_json(current_user)}
    }
  end
end
