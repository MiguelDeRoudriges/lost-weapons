import express from "express";

import weapons from "./weapons.js";
import { httpResponse } from "../utils/http.js";
import { generalStatus } from "../utils/http.js";

const router = express.Router();

router.get("/", (req, res) => {
  httpResponse(res, generalStatus.SUCCESS);
});

router.use(weapons);
export default router;
