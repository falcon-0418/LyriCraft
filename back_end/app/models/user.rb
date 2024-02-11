class User < ApplicationRecord
  authenticates_with_sorcery!
  has_many :api_keys, dependent: :destroy
  has_many :notes, dependent: :destroy
  has_many :social_profiles, dependent: :destroy

  validates :password, length: { minimum: 8 }, if: :should_validate_password?
  validates :password, confirmation: true, if: :should_validate_password?
  validates :password_confirmation, presence: true, if: :should_validate_password?
  validates :reset_password_token, uniqueness: true, allow_nil: true

  validates :email, uniqueness: true, presence: true
  validates :name, presence: true, length: { maximum: 255 }

  enum role: { general: 0, admin: 1 }

  def activate_api_key!
    return api_keys.active.first if api_keys.active.exists?

    api_keys.create
  end

  def deactivate_api_key!
    api_keys.active.destroy_all
  end

  private

  def should_validate_password?
    !is_social_login && (new_record? || changes[:crypted_password])
  end
end
