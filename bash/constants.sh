# constants.sh
# Lost Passports registry

DATABASE_NAME='registry'
MONGODB_URL='mongodb://mongodb:27017/registry'

# Dataset key from datagov 
DATASET_KEY="5e7a9e93-e4ae-408a-8b99-6a21bfa9c12a"

DATASET_DIRECTORY="/scripts"

# Source file
SOURCE_FILE="weaponswanted.json"

COLLECTION_NAME="weapons"

INDEXES="[{weaponKind:1},{weaponCaliber:1},{reasonSearch:1},{theftDate:'text'},{insertDate:1},{weaponNumber:1},{weaponSeries:1}]"
