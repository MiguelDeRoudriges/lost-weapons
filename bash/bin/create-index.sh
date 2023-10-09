#!/bin/bash

# Start time
collection=$1
indexes=$2

start=$(date +%s)

# Create indexes on the collection
mongosh "${MONGODB_URL}" --quiet --eval "
db.getSiblingDB('$DATABASE_NAME')
  .getCollection('$collection')
  .createIndexes($indexes)"

# End time
end=$(date +%s)

# Calculate elapsed time
elapsed_index=$((end - start))

echo -e "\nIndex creation $elapsed_index seconds."
echo -e "\n🫡 Import and index creation completed."
