namespace :db do
  desc "wordsテーブルのrhymeカラムを更新する"
  task update_rhymes: :environment do
    Word.update_rhymes
  end
end

#rake db:update_rhymes

# CREATE TEMP TABLE words_2 (
#   surface_form character varying,
#   left_context_id INTEGER,
#   right_context_id INTEGER,
#   cost INTEGER,
#   pos character varying,
#   pos_subcategory1 character varying,
#   pos_subcategory2 character varying,
#   pos_subcategory3 character varying,
#   conjugation_form character varying,
#   conjugation_type character varying,
#   base_form character varying,
#   reading character varying,
#   pronunciation character varying
# );

