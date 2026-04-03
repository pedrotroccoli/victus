namespace :cleanup do
  desc "Hard-delete all documents that were previously soft-deleted (have deleted_at set)"
  task purge_soft_deleted: :environment do
    unless ENV["CONFIRM"] == "1"
      abort "This task permanently deletes data. Re-run with CONFIRM=1 to proceed.\n" \
            "Example: CONFIRM=1 bundle exec rake cleanup:purge_soft_deleted"
    end

    client = Mongoid::Clients.default
    collections = %w[habits habit_checks subscriptions moods]

    collections.each do |collection_name|
      result = client[collection_name].delete_many(deleted_at: { "$exists" => true, "$ne" => nil })
      puts "#{collection_name}: removed #{result.deleted_count} soft-deleted documents"
    end

    # Embedded documents need $pull from parent collections
    embedded_purges = [
      { parent_collection: "habits", embedded_field: "habit_deltas" },
      { parent_collection: "habit_checks", embedded_field: "habit_check_deltas" }
    ]

    embedded_purges.each do |purge|
      result = client[purge[:parent_collection]].update_many(
        { "#{purge[:embedded_field]}.deleted_at" => { "$exists" => true, "$ne" => nil } },
        { "$pull" => { purge[:embedded_field] => { deleted_at: { "$exists" => true, "$ne" => nil } } } }
      )
      puts "#{purge[:parent_collection]}.#{purge[:embedded_field]}: purged from #{result.modified_count} parent documents"
    end
  end
end
