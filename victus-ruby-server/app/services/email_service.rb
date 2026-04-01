class EmailService
  def initialize()
    @client = Mailersend::Client.new(ENV['MAILERSEND_API_KEY'])
  end

  def send_welcome_email(account)
    email = Mailersend::Email.new(@client)
    email.add_recipients("email" => account.email.to_s, "name" => account.name.to_s)
    email.add_from("email" => "info@mail.victusjournal.com", "name" => "Victus Journal")
    email.add_subject("Bem vindo ao Victus Journal!")
    email.add_template_id("3yxj6lj5zexgdo2r")

    personalization = {
      email: account.email.to_s,
      data: {
        name: account.name.to_s,
        url: ENV['APP_URL']
      }
    }

    email.add_personalization(personalization)

    response = email.send

    raise response.body if response.status > 299 || response.status < 200

    rescue => e
      puts "\n\n\n", "Email error: \n", e, "\n\n\n"
  end
end
