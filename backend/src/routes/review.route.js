import express from "express";
import { getGameReviews, getUserReviews, createReview, updateReview, deleteReview } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Game Reviews & Ratings (protectRoute?)
router.get("/video-game/:id", getGameReviews);

//READ User Reviews & Ratings  (protectRoute)
router.get("/user", protectRoute, getUserReviews);

//CREATE Review (protectRoute)
router.post("/", protectRoute, createReview);

//UPDATE Review (protectRoute)
router.patch("/:id", protectRoute, updateReview);

//PATCH Platform (protectRoute)
router.patch("/:id/toggle", protectRoute, deleteReview);

export default router;