#!/bin/bash

# Check if constants.sh file exists
if [ ! -f constants.sh ]; then
  echo "ERROR: constants.sh file not found."
  exit 1
fi

# Load environment variables from constants.sh file
source constants.sh

set -e
# Check new revision
start_time=$(date +%s)

downloaded=""

# Assuming only one dataset now
dataset_key=$DATASET_KEY
dataset_directory=$DATASET_DIRECTORY

echo "Downloading dataset: $dataset_key"

command="--dir $dataset_directory --dataset $dataset_key"
if bin/download-dataset.sh $command; then
    echo "Command succeeded: $command";
    downloaded="true"
else
    echo "Command failed: $command";
fi

# Capture the end time
end_time=$(date +%s)

# Calculate and print the elapsed time
elapsed_time=$(($end_time - $start_time))
echo "Total elapsed time for downloading the file: $elapsed_time seconds"

[[ -n $downloaded ]] || { echo "No new revisions available!" >&2; exit 1; }

TEMP_COLLECTION_NAME="temp_$COLLECTION_NAME"
# Drop temporary collections if they exist
mongosh "${MONGODB_URL}" --eval "
  db.getSiblingDB('$DATABASE_NAME').getCollection('$TEMP_COLLECTION_NAME').drop();
"

start_time=$(date +%s)
# Import files to database
dir=$DATASET_DIRECTORY
files=$SOURCE_FILE

IFS=',' read -ra SOURCE_FILES_ARRAY <<< "${files}"
source bin/json/check-files-json.sh "$dir/current" $SOURCE_FILE
source bin/json/import-database-json.sh "$dir/current" "$files" "$TEMP_COLLECTION_NAME"

source bin/json/aggregate-temporary.sh "$COLLECTION_NAME" "$TEMP_COLLECTION_NAME"
source bin/create-index.sh $COLLECTION_NAME $INDEXES

# Capture the end time again
end_time=$(date +%s)

# Calculate and print the elapsed time for the import
elapsed_time=$(($end_time - $start_time))
echo "Total elapsed time for importing the file: $elapsed_time seconds"

mongosh "${MONGODB_URL}" --eval "
  const stats = db.getSiblingDB('$DATABASE_NAME').stats();
  print('📊 Database statistics:');
  print('DB:', stats.db);
  print('Collections:', stats.collections, stats.collections === 1 ? '✅' : '⛔️'); 
  print('Documents:', stats.objects);
  print('Indexes:', stats.indexes, stats.indexes === 8 ? '8' : '⛔️');
"
