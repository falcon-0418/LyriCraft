class RhymeParser
  RHYME_MAP = {
    'ア' => 'アァカガサザタダナハバパマヤャラワヮ',
    'イ' => 'イィキギシジチヂニヒビピミリ',
    'ウ' => 'ウゥヴクグスズツヅッヌフブプムユュルン',
    'エ' => 'エェケゲセゼテデネヘベペメレ',
    'オ' => 'オォコゴソゾトドノホボポモヨョロヲ',
  }

  private_constant :RHYME_MAP

  @reverse_rhyme_map = RHYME_MAP.each_with_object({}) do |(rhyme, chars_group), map|
    chars_group.chars.each do |char|
      map[char] ||= rhyme
    end
  end

  def self.parse_reading(reading)
    result = []

    reading.chars.each_with_index do |char, index|
      if char == 'ー' && index > 0
        prev_char = reading[index - 1]
        prev_vowel = @reverse_rhyme_map[prev_char] || raise("Unsupported character: #{prev_char}")
        result << prev_vowel
      else
        result << (@reverse_rhyme_map[char] || raise("Unsupported character: #{char}"))
      end
    end

    result.join
  end
end