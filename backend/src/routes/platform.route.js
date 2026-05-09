import express from "express";
import { getAllPlatforms, getPlatformOptions, createPlatform, updatePlatform, togglePlatformStatus } from "../controllers/platform.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Platforms for Admin EJ: GET /api/platforms?page=1&limit=10&search=sony&is_active=true
router.get("/", protectRoute, requireAdmin, getAllPlatforms);

//READ Platforms for Users
router.get("/options", getPlatformOptions);

//CREATE Plafrom (Admin) (protectRoute, requireAdmin)
router.post("/", protectRoute, requireAdmin, createPlatform);

//UPDATE Platform (Admin) (protectRoute, requireAdmin)
router.put(("/:id"), protectRoute, requireAdmin, updatePlatform);

//PATCH Platform (Admin) (protectRoute, requireAdmin)
router.patch(("/:id/toggle"), protectRoute, requireAdmin, togglePlatformStatus);

export default router;