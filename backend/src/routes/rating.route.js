import express from "express";
import { deleteRating, upsertRating } from "../controllers/rating.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//CREATE OR UPDATE Rating (protectRoute) 
router.post("/", protectRoute, upsertRating);

//DELETE Rating (protectRoute)
router.patch("/:id/toggle", protectRoute, deleteRating);


export default router;