class AccountsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:login, :register]
  def login
    # TODO: Prototype data
    if params[:username] == 'admin' and params[:password] == 'admin'
      render json: {success: true}
    else
      render json: {success: false, error: 'Invalid username or password.'}, status: 400
    end
  end
  def register
    # TODO: Prototype data
    if params[:username] == 'admin'
      render json: {success: false, error: 'Username already exists.'}, status: 400
    elsif params[:username].length > 30 or params[:username].length < 1 or params[:password].length > 255 or params[:password].length < 1 or params[:name].length > 255
      render json: {success: false, error: 'Data field length limit exceeded.'}, status: 400
    else
      render json: {success: true}
    end
  end
end
