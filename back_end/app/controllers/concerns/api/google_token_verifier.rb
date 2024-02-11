require 'jwt'
require 'net/http'
require 'json'

module Api::GoogleTokenVerifier
  extend ActiveSupport::Concern

  GOOGLE_ISSUER = 'https://accounts.google.com'.freeze
  AUDIENCE = Rails.application.credentials.dig(:google, :client_id).freeze

  class << self
    def verify(token)
      # トークンのヘッダーからkidを取得
      decoded_header = decode_token_header(token)
      kid = decoded_header['kid']

      # JWKSから対応する公開鍵を取得
      jwks_keys = fetch_jwks_keys
      public_key = jwks_keys[kid]

      if public_key.nil?
        Rails.logger.error("No matching public key found for kid: #{kid}")
        return nil
      end

      # トークンの署名を検証
      decoded_token = JWT.decode(token, public_key, true, {
        algorithm: 'RS256',
        iss: GOOGLE_ISSUER,
        verify_iss: true,
        aud: AUDIENCE,
        verify_aud: true
      })

      decoded_token.first # ペイロードを返す
    rescue JWT::VerificationError => e
      Rails.logger.error("JWT Verification Error: #{e.message}")
      nil
    end

    private

    def decode_token_header(token)
      header_segment = token.split('.').first
      decoded_segment = Base64.urlsafe_decode64(header_segment)
      JSON.parse(decoded_segment)
    end

    def fetch_jwks_keys
      jwks_uri = 'https://www.googleapis.com/oauth2/v3/certs'
      response = Net::HTTP.get(URI(jwks_uri))
      jwks = JSON.parse(response)

      jwks['keys'].each_with_object({}) do |key_data, keys|
        jwk = JWT::JWK.import(key_data)
        keys[key_data['kid']] = jwk.public_key
      end
    end
  end
end
