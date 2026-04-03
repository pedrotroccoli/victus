account = Account.find_or_create_by!(email: 'dev@victusjournal.com') do |a|
  a.name = 'Dev User'
  a.password = '12345678'
  a.password_confirmation = '12345678'
end

unless account.subscription
  account.create_trial_subscription
  account.save!
end

puts "  Seeded account: #{account.email}"
