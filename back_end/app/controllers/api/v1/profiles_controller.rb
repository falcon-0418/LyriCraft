class Api::V1::ProfilesController < Api::V1::BaseController
  before_action :authenticate

  def show
    render json: UserSerializer.new(current_user).serialized_json
  end
end
