class Analyzer
  def self.analyze_katakana(reading)
    RhymeParser.parse_reading(reading)
  end

  def self.analyze(input_word)
    nm = Natto::MeCab.new(dicdir: "/usr/local/lib/mecab/dic/mecab-ipadic-neologd")

    result = []

    nm.parse(input_word) do |n|

      reading = n.feature.split(',')[7]

      next if reading == '*'

      rhyme = RhymeParser.parse_reading(reading) if reading
      result << rhyme if rhyme
    end

    result
  end
end
