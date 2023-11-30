require "test_helper"

class Api::V1::RhymeSearchControllerTest < ActionDispatch::IntegrationTest
  test "should get search" do
    get api_v1_rhyme_search_search_url
    assert_response :success
  end
end
