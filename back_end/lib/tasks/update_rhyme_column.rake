namespace :db do
  desc "wordsテーブルのrhymeカラムを更新する"
  task update_rhymes: :environment do
    Word.update_rhymes
  end
end
