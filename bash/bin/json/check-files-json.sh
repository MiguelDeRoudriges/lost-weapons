#!/bin/bash

# Capture the parameters
directory="$1"
shift # Shift all parameters to the left (original $1 is gone)
source_files=("$@") # All remaining parameters are source files

# Arrays to store missing and other files
missing_files=()
other_files=()

# Check if the directory contains files other than the allowed files or lacks certain files
for file in "$directory"/*; do
  filename=$(basename "$file")
  if [[ ! " ${source_files[@]} " =~ " ${filename} " ]]; then
    other_files+=("$filename")
  fi
done

for allowed_file in "${source_files[@]}"; do
  if [ ! -f "$directory/$allowed_file" ]; then
    missing_files+=("$allowed_file")
  fi
done

# Output result
if [ ${#other_files[@]} -gt 0 ]; then
  echo -e "\nDirectory contains other files:\n"
  printf '%s\n' "${other_files[@]}"
  echo -e "\n✋ Check the SOURCE_FILES variable in the constants.sh file.\n"
fi

if [ ${#missing_files[@]} -gt 0 ]; then
  echo -e "Directory is missing the following files:\n"
  printf '%s\n' "${missing_files[@]}"
  echo -e "\n⛔️ Check the SOURCE_FILES variable in the constants.sh file.\n"
fi