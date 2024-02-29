import express from "express";
import {
  getAllWeapons,
  getWeaponsRegionStatistics,
  getWeaponsModelsStatistics,
  getNewWeaponsStatistics,
  getYearsWeaponsStatistics,
} from "../controllers/weapons.js";

const router = express.Router();

router.get("/api/weapons", getAllWeapons);
router.get("/api/weapons/regionStatistics", getWeaponsRegionStatistics);
router.get("/api/weapons/modelsStatistics", getWeaponsModelsStatistics);
router.get("/api/weapons/newStatistics", getNewWeaponsStatistics);
router.get("/api/weapons/yearsStatistics", getYearsWeaponsStatistics);

export default router;
