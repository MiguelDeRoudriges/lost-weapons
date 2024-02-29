import { pipe } from "ramda";
import WeaponModel from "../models/weaponModel.js";

import { createDateRange } from "../utils/dateUtils.js";

import {
  anyWordInListPattern,
  replace,
  lowerCase,
  upperCase,
  capitalizeFirstLetter,
  capitalizeUkrainianWords,
} from "../utils/helpers.js";

const abbreviations = ["ТН", "ДПА", "ГУНП", "РВ", "МУ", "ГУМВСУ", "РВВС"];

const prepositions = ["у", "в", "обл\\.", "м\\."];

const capitalizeAll = (list) => (str) =>
  replace(str, anyWordInListPattern(list), upperCase);

const lowercaseAll = (list) => (str) =>
  replace(str, anyWordInListPattern(list), lowerCase);

const normalizeAuthority = pipe(
  capitalizeUkrainianWords,
  capitalizeAll(abbreviations),
  lowercaseAll(prepositions)
);

const getAggregatedNewWeaponsData = async (dateFrom, dateTo) => {
  const match = {
    insertDate: {
      $gte: dateFrom,
      $lte: dateTo,
    },
  };

  const pipeline = [
    { $match: match },
    {
      $addFields: {
        insertDate: {
          $dateFromString: {
            dateString: "$insertDate",
            format: "%Y-%m-%d", // Assuming the date string is formatted as YYYY-MM-DD
          },
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$insertDate",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        count: 1,
        date: "$_id",
      },
    },
  ];

  const result = await WeaponModel.aggregate(pipeline);

  return result;
};

const weaponMapper = ({
  _id,
  status,
  organUnit,
  producer,
  weaponType,
  weaponKind,
  reasonSearch,
  ...rest
}) => ({
  organUnit: organUnit && normalizeAuthority(organUnit),
  producer: producer && capitalizeFirstLetter(producer),
  weaponType: weaponType && capitalizeFirstLetter(weaponType),
  weaponKind: weaponKind && capitalizeFirstLetter(weaponKind),
  reasonSearch: reasonSearch && capitalizeFirstLetter(reasonSearch),
  ...rest,
});

const mapSubscriptionCounts = (dateRange, subscriptionsData) => {
  return dateRange.map((date) => {
    const subscription = subscriptionsData.find((p) => p.date === date);
    return subscription ? subscription.count : 0;
  });
};

export const getAllWeapons = async ({
  offset = null,
  limit = 12,
  sortDirection = 1,
  sortKeys = null,
  searchKeys = null,
  searchQuery = null,
}) => {
  const match = {};

  if (searchKeys && searchQuery) {
    const keysArray = searchKeys.split(",");

    if (
      keysArray.includes("weaponNumber") &&
      keysArray.includes("weaponSeries")
    ) {
      // Extract digits for weaponNumber
      const numberPart = searchQuery.match(/\d+/)
        ? searchQuery.match(/\d+/)[0]
        : "";

      // Extract non-digits for weaponSeries
      const seriesPart = searchQuery.replace(/\d+/g, "");

      const conditions = [
        { weaponNumber: numberPart },
        { weaponSeries: seriesPart },
      ];

      // console.log(conditions);

      const filterConditions = (condition) => {
        const [key] = Object.keys(condition);
        return condition[key] && condition[key].trim() !== "";
      };

      // // Показывает по любому номеру и любой серии
      // match.$and = conditions.filter(filterConditions);

      // Показывает только серия и номер, если нету одного из них, то ничего не показывает
      match.$and = conditions;

      // console.log(match);
    } else {
      match.$or = keysArray.map((key) => ({
        [`${key.trim()}`]: searchQuery,
      }));
    }
  }

  // console.log(match);

  const sortObject = {};
  if (sortKeys) {
    sortKeys.split(",").forEach((key) => {
      sortObject[key.trim()] = sortDirection;
    });
  }

  const aggregationArray = [{ $match: match }];

  if (Object.keys(sortObject).length > 0) {
    aggregationArray.push({ $sort: sortObject });
  }
  const facetObj = {
    paginatedResults: [],
    totalCount: [{ $count: "count" }],
  };

  if (offset !== null) facetObj.paginatedResults.push({ $skip: offset });
  if (limit !== null) facetObj.paginatedResults.push({ $limit: limit });

  if (offset !== null || limit !== null) {
    aggregationArray.push({ $facet: facetObj });
  }

  const aggregationResult = await WeaponModel.aggregate(
    aggregationArray
  ).allowDiskUse(true);

  let result;
  if (offset !== null || limit !== null) {
    result = {
      count: aggregationResult[0].totalCount[0]?.count || 0,
      data: aggregationResult[0].paginatedResults.map(weaponMapper),
    };
  } else {
    result = {
      count: aggregationResult.length,
      data: aggregationResult.map(weaponMapper),
    };
  }
  return result;
};

export const getWeaponsRegionStatistics = async (req) => {
  const pipline = [
    {
      $sortByCount: "$organUnit",
    },
    {
      $project: {
        organUnit: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ];
  const aggregationResult = await WeaponModel.aggregate(pipline);

  return aggregationResult;
};

export const getWeaponsModelsStatistics = async (req) => {
  const pipline = [
    {
      $sortByCount: "$brandModel",
    },
    {
      $project: {
        organUnit: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ];
  const aggregationResult = await WeaponModel.aggregate(pipline);

  return aggregationResult;
};

export const getNewWeaponsStatistics = async ({ dateFrom, dateTo }) => {
  const weaponsData = await getAggregatedNewWeaponsData(dateFrom, dateTo);

  const dateRange = createDateRange(dateFrom, dateTo);
  const result = mapSubscriptionCounts(dateRange, weaponsData); // You may want to rename mapSubscriptionCounts to something more relevant, like mapWeaponCounts

  return {
    pointStart: dateFrom,
    pointIntervalUnit: "year",
    data: result,
  };
};

export const getYearsWeaponsStatistics = async (req) => {
  const pipline = [
    {
      $addFields: {
        theftDate: {
          $toDate: "$theftDate",
        },
      },
    },
    {
      $match: {
        theftDate: {
          $gte: new Date("1970-01-01T00:00:00Z"),
        },
      },
    },
    {
      $group: {
        _id: { $year: "$theftDate" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        year: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ];

  const aggregationResult = await WeaponModel.aggregate(pipline);

  return aggregationResult;
};

export default {
  getAllWeapons,
  getWeaponsRegionStatistics,
  getWeaponsModelsStatistics,
  getNewWeaponsStatistics,
  getYearsWeaponsStatistics,
};
