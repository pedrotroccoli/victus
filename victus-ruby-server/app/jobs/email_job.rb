class EmailJob < ApplicationJob
  queue_as :default

  def perform(account_id)
    account = Account.find(account_id)
    EmailService.new.send_welcome_email(account)
  end
end
