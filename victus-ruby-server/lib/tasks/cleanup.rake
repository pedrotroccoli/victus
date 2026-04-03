namespace :cleanup do
  desc "Hard-delete all documents that were previously soft-deleted (have deleted_at set)"
  task purge_soft_deleted: :environment do
    collections = %w[habits habit_checks subscriptions moods]

    collections.each do |collection_name|
      collection = Mongoid.default_client[collection_name]
      result = collection.delete_many(deleted_at: { "$exists" => true, "$ne" => nil })
      puts "#{collection_name}: removed #{result.deleted_count} soft-deleted documents"
    end

    # Embedded documents need $pull from parent collections
    embedded_purges = [
      { parent_collection: "habits", embedded_field: "habit_deltas" },
      { parent_collection: "habit_checks", embedded_field: "habit_check_deltas" }
    ]

    embedded_purges.each do |purge|
      collection = Mongoid.default_client[purge[:parent_collection]]
      result = collection.update_many(
        { "#{purge[:embedded_field]}.deleted_at" => { "$exists" => true, "$ne" => nil } },
        { "$pull" => { purge[:embedded_field] => { deleted_at: { "$exists" => true, "$ne" => nil } } } }
      )
      puts "#{purge[:parent_collection]}.#{purge[:embedded_field]}: purged from #{result.modified_count} parent documents"
    end
  end
end
