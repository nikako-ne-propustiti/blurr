class AccountsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:login]
  def login
    # TODO: Prototype data
    if params[:username] == 'admin' and params[:password] == 'admin'
      render json: {success: true}
    else
      render json: {success: false, error: 'Invalid username or password.'}, status: 400
    end
  end
end
