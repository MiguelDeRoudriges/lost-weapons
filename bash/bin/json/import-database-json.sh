#!/bin/bash

set -e

# Start time
start=$(date +%s)

# Directory
directory=$1
source_files=$2
temp_collection=$3  # Collection for aggregated data

# Import JSON to the import collection
for file in "${SOURCE_FILES_ARRAY[@]}"; do
    echo "Importing file: $file"
    mongoimport "${MONGODB_URL}" \
	        --quiet \
		--collection "$temp_collection" \
		--type json \
		--file "$directory/$file" \
		--jsonArray
done

# After import, add dataset_name field to all documents
mongosh "${MONGODB_URL}" --eval "db.getCollection('$temp_collection')"

# End time
end=$(date +%s)

# Calculate elapsed time
elapsed=$((end - start))

echo -e "\nImport time for json: $elapsed seconds.\n"

set +e
