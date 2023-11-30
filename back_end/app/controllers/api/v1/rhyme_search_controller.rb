class Api::V1::RhymeSearchController < ApplicationController
  def search
    input_word = params[:word]
    matched_words = Word.search_by_input_word(input_word)
    render json: matched_words
  end
end