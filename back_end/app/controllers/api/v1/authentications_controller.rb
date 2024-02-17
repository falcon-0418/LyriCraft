class Api::V1::AuthenticationsController < Api::V1::BaseController

  skip_before_action :authenticate, only: [:create, :google_create]

  def create
    @user = login(params[:email], params[:password])

    raise ActiveRecord::RecordNotFound unless @user

    json_string = UserSerializer.new(@user).serialized_json
    set_access_token!(@user)

    render json: json_string
  end

  def google_create
    token = params[:token]
    user_info = Api::GoogleTokenVerifier.verify(token)

    if user_info
      @user = find_or_create_user(user_info)

      if @user.errors.blank?
        @user.update(is_social_login: true)
        if @user.new_record?
          @user.notes.create(title: '', body: '')
        end

        create_or_update_social_profile(@user, user_info)

        json_string = UserSerializer.new(@user).serialized_json
        set_access_token!(@user)

        render json: json_string
      else
        render_422(nil, @user.errors.full_messages)
      end
    else
      render_401(nil, @user.errors.full_messages)
    end
  end

  def destroy
    if current_user
      current_user.deactivate_api_key!
      head :ok
    else
      head :unauthorized
    end
  end

  private

  def login_params
    params.require(:user).permit(:email, :password)
  end

  def google_auth_params
    params.permit(:token)
  end

   def find_or_create_user(user_info)
    user = User.find_or_initialize_by(email: user_info['email'])
    if user.new_record?
      user.name = user_info['name']
      user.is_social_login = true
      user.save(validate: false)
    end
    user
  end

  def create_or_update_social_profile(user, payload)
    SocialProfile.find_or_create_by(user_id: user.id, provider: "google") do |profile|
      profile.uid = payload['sub']
    end
  end
end
