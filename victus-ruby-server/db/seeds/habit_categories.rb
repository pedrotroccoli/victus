account = Account.find_by(email: 'dev@victusjournal.com')

if account
  [
    { name: 'Health', icon: 'heart', order: 1000.0 },
    { name: 'Productivity', icon: 'target', order: 2000.0 },
    { name: 'Mindfulness', icon: 'brain', order: 3000.0 }
  ].each do |attrs|
    HabitCategory.find_or_create_by!(name: attrs[:name], account: account) do |c|
      c.icon = attrs[:icon]
      c.order = attrs[:order]
    end
  end

  puts "  Seeded habit categories"
end
