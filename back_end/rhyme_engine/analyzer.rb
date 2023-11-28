class Analyzer
  def self.analyze_katakana(reading)
    RhymeParser.parse_reading(reading)
  end
end