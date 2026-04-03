class EmailJob < ApplicationJob
  queue_as :default

  retry_on Net::OpenTimeout, Net::ReadTimeout, Resend::Error, wait: :polynomially_longer, attempts: 3
  discard_on ActiveJob::DeserializationError

  def perform(account_id)
    account = Account.find(account_id)
    AccountMailer.with(account: account).welcome_email.deliver_now
  end
end
