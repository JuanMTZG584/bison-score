import express from "express";
import { getGamesDistributionReport, getMostReviewedGamesReport, getTopRatedGamesReport, getUserActivityReport } from "../controllers/report.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

router.get("/top-rated-games", protectRoute, requireAdmin, getTopRatedGamesReport);

router.get("/most-reviewed-games", protectRoute, requireAdmin, getMostReviewedGamesReport);

router.get("/user-activity", protectRoute, requireAdmin, getUserActivityReport);

router.get("/games-distribution", protectRoute, requireAdmin, getGamesDistributionReport);

export default router;