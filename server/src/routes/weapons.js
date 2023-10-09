import express from "express";
import {
  getAllWeapons,
  getWeaponsRegionStatistics,
  getWeaponsModelsStatistics,
  getNewWeaponsStatistics,
} from "../controllers/weapons.js";

const router = express.Router();

router.get("/weapons", getAllWeapons);
router.get("/weapons/regionStatistics", getWeaponsRegionStatistics);
router.get("/weapons/modelsStatistics", getWeaponsModelsStatistics);
router.get("/weapons/newStatistics", getNewWeaponsStatistics);

export default router;
