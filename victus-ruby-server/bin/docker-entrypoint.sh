#!/bin/bash
set -e

echo "Running data migrations..."
bundle exec rails db:migrate
echo "Migrations complete."

exec "$@"
