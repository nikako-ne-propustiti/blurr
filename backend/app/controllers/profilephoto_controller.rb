class ProfilePhotoController < ApplicationController
  before_action :check_logged_in

  ##
  # POST /api/accounts/pfp
  # Form:
  # username - username
  # pfp - profile photo
  #
  # Sets a new profile photo for the user. Returns error if inadequate.
  def set_profile_photo

  end
end
