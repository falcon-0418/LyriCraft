class AddIsSocialLoginToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :is_social_login, :boolean,  default: false
  end
end
