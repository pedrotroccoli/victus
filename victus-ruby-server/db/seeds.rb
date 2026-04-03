if Rails.env.development?
  seed_dir = Rails.root.join('db', 'seeds')

  %w[accounts habit_categories habits].each do |seed|
    file = seed_dir.join("#{seed}.rb")
    load(file.to_s) if file.exist?
  end

  puts "Seeding complete."
end
