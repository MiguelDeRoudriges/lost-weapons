import express from "express";
import {
  getAllWeapons,
  getWeaponsRegionStatistics,
  getWeaponsModelsStatistics,
  getNewWeaponsStatistics,
  getYearsWeaponsStatistics,
} from "../controllers/weapons.js";

const router = express.Router();

router.get("/weapons", getAllWeapons);
router.get("/weapons/regionStatistics", getWeaponsRegionStatistics);
router.get("/weapons/modelsStatistics", getWeaponsModelsStatistics);
router.get("/weapons/newStatistics", getNewWeaponsStatistics);
router.get("/weapons/yearsStatistics", getYearsWeaponsStatistics);

export default router;
