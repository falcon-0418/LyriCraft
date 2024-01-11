class CreateNotes < ActiveRecord::Migration[7.1]
  def change
    create_table :notes do |t|
      t.string :title
      t.text :body
      t.boolean :is_public, default: false
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
