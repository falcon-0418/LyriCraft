class Api::V1::AuthenticationsController < Api::V1::BaseController
  skip_before_action :authenticate, only: [:create]

  def create
    @user = login(params[:email], params[:password])

    raise ActiveRecord::RecordNotFound unless @user

    json_string = UserSerializer.new(@user).serialized_json
    set_access_token!(@user)

    render json: json_string
  end

  def destroy
    if current_user
      current_user.deactivate_api_key!
      head :ok 
    else
      head :unauthorized
    end
  end
end