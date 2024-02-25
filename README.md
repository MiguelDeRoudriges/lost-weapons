![Infohorizon](https://cronitor.io/badges/4ljCLp/production/HXRuC_irYErzR404JyPAMwj21Js.svg)
https://infohorizon.yvhn.io/
# lost-weapons Project Setup

**Clone the repository**: `git clone https://github.com/MiguelDeRoudriges/lost-weapons`

## Bash part

1. **Navigate to the project directory**: `cd bash`

Change the variables in file `constants.sh` to your local

```constants.sh
# Lost Passports registry

#Mongo Connection constants
DATABASE_NAME='registry'
COLLECTION_NAME="weapons"
MONGODB_URL='mongodb://localhost:27017/registry'

# Dataset key from datagov
DATASET_KEY="5e7a9e93-e4ae-408a-8b99-6a21bfa9c12a"

#directory for saved json
DATASET_DIRECTORY="/Users/mykhailosvyrydov/Desktop/weapon-registry/downloads/weapons"

# Source file name
SOURCE_FILE="weaponswanted.json"


INDEXES="[{weaponKind:1},{weaponCaliber:1},{reasonSearch:1},{theftDate:'text'},{insertDate:1},{weaponNumber:1},{weaponSeries:1}]"
```

Now run command `bash import.sh` and wait for downloads

## Server part

This guide will walk you through the steps necessary to set up and run the server part.

### Prerequisites

Before you start, make sure you have Node.js and npm installed on your local machine. If not, you can download and install them from the [official Node.js website](https://nodejs.org/en/download/).

### Project Setup Steps

1. **Navigate to the project directory**: `cd server`
2. **Install dependencies**: `npm install`

### Configure the Environment

Create a .env file in the root directory of the project with the following configuration:

```env
# GENERAL
BASE_URL=http://localhost:3000
PORT=3000

DB_URL='mongodb://127.0.0.1:27017/registry'

```

### Running the Project

**To start the development server, run:** `npm run dev`

**To run the project in production mode directly, run:** `npm run prod`

**To build the project for production, run:**: `npm run build`

**To start the project in production mode, run the build file:**:`node dist/bundle.js`

## Client part

### Project Setup Steps

1. **Navigate to the project directory**: `cd client`
2. **Install dependencies**: `npm install`

### Running the Project

### Development
```haskell
npm run dev
```

### Production

```haskell
npm run build
npm run start
```



