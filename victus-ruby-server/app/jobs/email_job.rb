class EmailJob < ApplicationJob
  queue_as :default

  retry_on Net::OpenTimeout, Net::ReadTimeout, wait: :polynomially_longer, attempts: 3
  discard_on ActiveJob::DeserializationError, Resend::Error

  def perform(account_id)
    account = Account.find(account_id)
    AccountMailer.with(account: account).welcome_email.deliver_now
  end
end
