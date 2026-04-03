return if Rails.env.production?

seed_dir = Rails.root.join('db', 'seeds')

%w[accounts habit_categories habits].each do |seed|
  file = seed_dir.join("#{seed}.rb")
  load(file) if file.exist?
end

puts "Seeding complete."
