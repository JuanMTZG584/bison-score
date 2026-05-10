import express from "express";
import { getGamesDistributionReport, getMostReviewedGamesReport, getTopRatedGamesReport, getUserActivityReport } from "../controllers/report.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

router.get("/top-rated-games", protectRoute, getTopRatedGamesReport);

router.get("/most-reviewed-games", protectRoute, getMostReviewedGamesReport);

router.get("/user-activity", protectRoute, getUserActivityReport);

router.get("/games-distribution", protectRoute, getGamesDistributionReport);

export default router;