#!/bin/bash

set -e

echo -e "\nAggregation database.\n"

collection=$1
temp_collection=$2

start=$(date +%s)

AGGREGATION_PIPELINE='[
  {
    $project: {
      _id: 1,
      brandModel: { $cond: [{ $eq: ["$brandmodel", ""] }, "$$REMOVE", { $trim: { input: "$brandmodel" } }] },
      producer: { $cond: [{ $eq: ["$producer", ""] }, "$$REMOVE", { $trim: { input: "$producer" } }] },
      weaponType: { $cond: [{ $eq: ["$weapontype", ""] }, "$$REMOVE", { $trim: { input: "$weapontype" } }] },
      weaponKind: { $cond: [{ $eq: ["$weaponkind", ""] }, "$$REMOVE", { $trim: { input: "$weaponkind" } }] },
      weaponSeries: { $cond: [{ $eq: ["$weaponseries", ""] }, "$$REMOVE", { $trim: { input: "$weaponseries" } }] },
      weaponNumber: { $cond: [{ $eq: ["$weaponnumber", ""] }, "$$REMOVE", { $trim: { input: "$weaponnumber" } }] },
      weaponCaliber: { $cond: [{ $eq: ["$weaponcaliber", ""] }, "$$REMOVE", { $trim: { input: "$weaponcaliber" } }] },
      trunks: { $cond: [{ $eq: ["$trunks", ""] }, "$$REMOVE", { $trim: { input: "$trunks" } }] },
      graduationYear: { $cond: [{ $eq: ["$graduationyear", ""] }, "$$REMOVE", { $trim: { input: "$graduationyear" } }] },
      organUnit: { $cond: [{ $eq: ["$organunit", ""] }, "$$REMOVE", { $trim: { input: "$organunit" } }] },
      reasonSearch: { $cond: [{ $eq: ["$reasonsearch", ""] }, "$$REMOVE", { $trim: { input: "$reasonsearch" } }] },
      theftDate: {
        $ifNull: [
            {
              $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $toDate: "$theftdate" }
              }
            }, 
            "$$REMOVE"
        ]
      },
      insertDate: {
        $ifNull: [
            {
              $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $toDate: "$insertdate" }
              }
            },
            "$$REMOVE"
        ]
      },
    }
  },
  {
    $out: "'$collection'"
  }
]'



mongosh "${MONGODB_URL}" --eval "
  db.getSiblingDB('$DATABASE_NAME')
    .getCollection('$temp_collection')
    .aggregate($AGGREGATION_PIPELINE);
  db.getSiblingDB('$DATABASE_NAME')
    .getCollection('$temp_collection')
    .drop();

"

# End time
end=$(date +%s)

# Calculate elapsed time
elapsed=$((end - start))

echo -e "\nAggregation time: $elapsed seconds.\n"
