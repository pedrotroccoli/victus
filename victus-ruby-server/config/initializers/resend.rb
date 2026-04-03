resend_api_key = ENV["RESEND_API_KEY"]

if Rails.env.production? && resend_api_key.blank?
  raise "Missing required ENV['RESEND_API_KEY'] for Resend configuration"
end

Resend.api_key = resend_api_key
