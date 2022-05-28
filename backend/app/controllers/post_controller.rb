require 'securerandom'

class PostController < ApplicationController

    before_action :check_logged_in
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
            render json: {success: false, error: post.errors.full_messages[0]}, status: 400
            return
        end

        File.binwrite("public/images/#{post.file_uuid}#{password}.jpg", image.read)
        imageLocked = MiniMagick::Image.open("public/images/#{post.file_uuid}#{password}.jpg")

        imageLocked.combine_options do |i|
            i.blur "0x#{blur_level*5}"
        end

        imageLocked.write "public/images/#{post.file_uuid}.jpg"

        post.save

        render json: {
            success: true,
            url: post.post_url
        }
    end
end
