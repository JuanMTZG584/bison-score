import express from "express";
import { getGameReviews, getUserReviews, createReview, updateReview, deleteReview } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Game Reviews (protectRoute?)
router.get("/video-game/:id", getGameReviews);

//READ User Reviews (protectRoute)
router.get("/user/:id", getUserReviews);

//CREATE Review (protectRoute)
router.post("/", createReview);

//UPDATE Review (protectRoute)
router.patch("/:id", updateReview);

//PATCH Platform (protectRoute)
router.patch("/:id/toggle", deleteReview);

export default router;