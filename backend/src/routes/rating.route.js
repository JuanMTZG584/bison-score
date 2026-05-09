import express from "express";
import { deleteRating, getGameRatings, getUserRatings, upsertRating } from "../controllers/rating.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//CREATE OR UPDATE Rating (protectRoute) 
router.post("/", upsertRating);

//READ Game Rating (protectRoute?) 
router.get("/video-game/:id", getGameRatings);

//READ User Ratings (protectRoute) 
router.get("/user", getUserRatings);

//DELETE Rating (protectRoute)
router.patch("/:id/toggle", deleteRating);


export default router;