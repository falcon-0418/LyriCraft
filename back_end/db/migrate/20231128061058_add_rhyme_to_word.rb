class AddRhymeToWord < ActiveRecord::Migration[7.1]
  def change
    add_column :words, :rhyme, :string
  end
end
