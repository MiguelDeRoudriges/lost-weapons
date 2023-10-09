#!/bin/bash

# Prompt for confirmation
read -p "Do you want to delete the '$DATABASE_NAME' database? (y/n) " answer
if [[ $answer == "y" ]]; then
  # Connect to MongoDB and delete the database
  mongosh "$MONGODB_URL" --eval "
  db.getSiblingDB('$DATABASE_NAME')
    .dropDatabase()"
  echo -e "\nDatabase '$DATABASE_NAME' deleted.\n"
else
  echo -e "\nDeletion canceled.\n"
fi
