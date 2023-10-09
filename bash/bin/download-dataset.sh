#!/bin/bash

# Required packages: curl, jq

# Function to download a file
download_file() {
    local url=$1
    local user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0"
    wget --read-timeout=30 --quiet --continue --user-agent="$user_agent" "$url" || { echo "Can't download file: $url"; exit 1; }
}


# Check if required arguments are provided
if [ $# -eq 0 ]; then
    echo "No arguments!"
    exit 1
fi

# Default values
curl_opts=""
dataset_id=""
folder_name=""
latest=1
data_url=""
user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --dataset)
            dataset_id="$2"
            shift
            ;;
        --dir)
            folder_name="$2"
            shift
            ;;
        --latest)
            latest="$2"
            shift
            ;;
        --zip-convert)
            zip_convert="1"
            ;;
        *)
            echo "Unknown argument: $key"
            exit 1
            ;;
    esac
    shift
done

# Check if dataset_id or resource_id is provided
if [ -z "$dataset_id" ]; then
    echo "Dataset_id must be provided!"
    exit 1
fi

if [ -n "$dataset_id" ]; then
    r_json=$(curl $curl_opts -s --user-agent "$user_agent" "https://data.gov.ua/api/3/action/package_show?id=$dataset_id" 2>/dev/null) || { echo "Can't get response: $dataset_id"; exit 1; }
fi

# Extract required information from the JSON response
cyear=""
cmon=""
cday=""
time=""

if [ -n "$dataset_id" ]; then
    metadata_modified=$(echo "$r_json" | jq -r '.result.metadata_modified')
    [[ $metadata_modified =~ ^20([0-9]+)-([0-9]+)-([0-9]+)T(.*)\. ]]
    cyear="${BASH_REMATCH[1]}"
    cmon="${BASH_REMATCH[2]}"
    cday="${BASH_REMATCH[3]}"
    time="${BASH_REMATCH[4]}"
fi

# Set directory paths
dataset_dir="$folder_name"
data_dir="$dataset_dir/$cyear$cmon$cday"
get_ready="$data_dir/.ready"

# Check if the latest option is enabled and no new revision is available
if [ $latest -eq 1 ] && [ -d "$data_dir" ] && [ -f "$get_ready" ]; then
    echo "No new revision available.";
    exit 1;
fi

# Create dataset directory if it doesn't exist
[ -d "$data_dir" ] || mkdir -p "$data_dir" || { echo "Can't create directory: $data_dir"; exit 1; }

# Change to the dataset directory
cd "$data_dir" || { echo "Can't change directory: $data_dir"; exit 1; }


# Download all resources if dataset_id is provided
if [ -n "$dataset_id" ]; then
    num_resources=$(echo "$r_json" | jq -r '.result.num_resources')
    for ((i = 0; i < num_resources; i++)); do
        data_url=$(echo "$r_json" | jq -r ".result.resources[$i].url")
        download_file "$data_url"
    done
fi

# Update the current dataset directory
rm -f "$dataset_dir/current"
ln -s "$data_dir" "$dataset_dir/current"

# Create the .ready file
touch "$get_ready"
