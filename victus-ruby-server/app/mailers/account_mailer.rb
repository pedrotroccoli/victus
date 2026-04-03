class AccountMailer < ApplicationMailer
  def welcome_email
    @account = params[:account]
    mail(to: @account.email, subject: "Bem vindo ao Victus Journal!")
  end
end
