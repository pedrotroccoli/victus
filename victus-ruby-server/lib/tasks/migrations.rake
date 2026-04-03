namespace :migrations do
  desc "Mark initial migrations as already executed (they ran as rake tasks before the migration system existed)"
  task mark_initial_as_run: :environment do
    collection = Mongoid.default_client[:data_migrations]

    migrations = [
      { version: '20260402000001' },
      { version: '20260402000002' }
    ]

    migrations.each do |migration|
      if collection.find(version: migration[:version]).count.zero?
        collection.insert_one(migration)
        puts "Marked migration #{migration[:version]} as executed"
      else
        puts "Migration #{migration[:version]} already marked as executed"
      end
    end
  end
end
