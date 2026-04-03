class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_FROM", "info@victusjournal.com")
  layout 'mailer'
end
