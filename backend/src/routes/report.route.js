import express from "express";
import { getGamesDistributionReport, getMostReviewedGamesReport, getTopRatedGamesReport, getUserActivityReport } from "../controllers/report.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

router.get("/top-rated-games", getTopRatedGamesReport);

router.get("/most-reviewed-games", getMostReviewedGamesReport);

router.get("/user-activity", getUserActivityReport);

router.get("/games-distribution", getGamesDistributionReport);

export default router;