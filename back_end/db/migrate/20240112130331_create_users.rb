class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :crypted_password
      t.string :salt
      t.string :reset_password_token, default: nil
      t.datetime :reset_password_sent_at, default: nil
      t.datetime :reset_password_expires_at, default: nil
      t.integer :access_count_to_reset_password_page, default: 0
      t.integer :role, default:0, null: false
      t.string :avatar

      t.timestamps
      t.index :email, unique: true
      t.index :reset_password_token, unique: true
    end
  end
end
