class AccountMailer < ApplicationMailer

  def welcome_email
    @account = params[:account]
    puts "Account= \n\n"
    puts @account
    puts "/Account \n\n"
    # mail(to: @account.email, subject: 'Bem vindo ao Victus!')
  end
end
