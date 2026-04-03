namespace :cleanup do
  desc "Hard-delete all documents that were previously soft-deleted (have deleted_at set)"
  task purge_soft_deleted: :environment do
    collections = %w[habits habit_checks habit_deltas habit_check_deltas subscriptions moods]

    collections.each do |collection_name|
      collection = Mongoid.default_client[collection_name]
      result = collection.delete_many(deleted_at: { "$ne" => nil })
      puts "#{collection_name}: removed #{result.deleted_count} soft-deleted documents"
    end
  end
end
