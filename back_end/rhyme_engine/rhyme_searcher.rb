#スクリプト上でマッチングテストするためのファイル

def search_words_by_rhyme(rhyme)
  query = Word.where(rhyme: rhyme)
  puts "DEBUG: Executing query: #{query.to_sql}"
  query.pluck(:base_form)
end

def main
  loop do
    print '単語を入力してください > '
      word = gets.chomp

      break if word.downcase == "exit"
      next if word.empty?

      rhymes = Analyzer.analyze(word)
      next if rhymes.empty?
      rhyme = rhymes[0]

      puts "解析結果の韻: #{rhyme}"

      matched_words = search_words_by_rhyme(rhyme)

      if matched_words.empty?
        puts "母音が一致する単語は見つかりませんでした"
      else
        puts "母音が一致する単語:"
        matched_words.each do |w|
        puts w
      end
    end
  end
end

main
