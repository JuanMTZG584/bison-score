import express from "express";
import { getAllPlatforms, getPlatformOptions, createPlatform, updatePlatform, togglePlatformStatus } from "../controllers/platform.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Platforms for Admin (protectRoute, requireAdmin)
router.get("/", getAllPlatforms);

//READ Platforms for Users (protectRoute)?
router.get("/options", getPlatformOptions);

//CREATE Plafrom (Admin) (protectRoute, requireAdmin)
router.post("/", protectRoute, requireAdmin, createPlatform);

//UPDATE Platform (Admin) (protectRoute, requireAdmin)
router.put(("/:id"), protectRoute, requireAdmin, updatePlatform);

//PATCH Platform (Admin) (protectRoute, requireAdmin)
router.patch(("/:id/toggle"), protectRoute, requireAdmin, togglePlatformStatus);

export default router;