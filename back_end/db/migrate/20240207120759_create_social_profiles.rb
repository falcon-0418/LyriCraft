class CreateSocialProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :social_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false
      t.string :uid, null: false
      t.string :raw_info

      t.timestamps
    end
  end
end
