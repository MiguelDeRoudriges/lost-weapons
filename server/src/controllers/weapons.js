import { httpResponse, httpResponseError, generalStatus } from "../utils/http.js";
import weaponsService from "../services/weaponsService.js";


export const getAllWeapons = async (req, res) => {
  try {
    const offset = !Number.isNaN(+req.query.offset)
      ? +req.query.offset
      : undefined;
    const limit = !Number.isNaN(+req.query.limit)
      ? +req.query.limit
      : undefined;

    let sortDirection;
    if (req.query.sortDirection === "ASC") {
      sortDirection = 1;
    } else if (req.query.sortDirection === "DESC") {
      sortDirection = -1;
    } else {
      sortDirection = undefined;
    }

    const sortKeys = req.query.sortKeys ? req.query.sortKeys : undefined;

    const searchKeys = req.query.searchKeys ? req.query.searchKeys : undefined;
    const searchQuery = req.query.searchQuery
      ? req.query.searchQuery
      : undefined;
      
    const weapons = await weaponsService.getAllWeapons({
      offset,
      limit,
      sortDirection,
      sortKeys,
      searchKeys,
      searchQuery,
    });

    httpResponse(res, generalStatus.SUCCESS, weapons);
  } catch (error) {
    httpResponseError(res, error);
  }
};

export const getWeaponsRegionStatistics = async (req, res) => {
  try {

    const weapons = await weaponsService.getWeaponsRegionStatistics();

    httpResponse(res, generalStatus.SUCCESS, weapons);
  } catch (error) {
    httpResponseError(res, error);
  }
};

export const getWeaponsModelsStatistics = async (req, res) => {
  try {

    const weapons = await weaponsService.getWeaponsModelsStatistics();

    httpResponse(res, generalStatus.SUCCESS, weapons);
  } catch (error) {
    httpResponseError(res, error);
  }
};

export const getNewWeaponsStatistics = async (req, res) => {
  try {
    const statistics = await weaponsService.getNewWeaponsStatistics({
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    });

    httpResponse(res, generalStatus.SUCCESS, statistics);
  } catch (error) {
    httpResponseError(res, error);
  }
};

export const getYearsWeaponsStatistics = async (req, res) => {
  try {

    const weapons = await weaponsService.getYearsWeaponsStatistics();

    httpResponse(res, generalStatus.SUCCESS, weapons);
  } catch (error) {
    httpResponseError(res, error);
  }
};
