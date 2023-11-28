class Word < ApplicationRecord
  def self.update_rhymes
    where.not(reading: nil).find_each(batch_size: 1000) do |word|
      begin
        rhyme = Analyzer.analyze_katakana(word.reading)
        word.update(rhyme: rhyme) if rhyme.present?
      rescue StandardError => e
        puts "Error processing word ID #{word.id}: #{e.message}"
      end
    end
  end
end
