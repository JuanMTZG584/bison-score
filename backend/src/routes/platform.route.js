import express from "express";
import { getAllPlatforms, getPlatformOptions, createPlatform, updatePlatform, deletePlatform } from "../controllers/platform.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Platforms for Admin (protectRoute, requireAdmin)
router.get("/", getAllPlatforms);

//READ Platforms for Users (protectRoute)?
router.get("/options", getPlatformOptions);

//CREATE Plafrom (Admin) (protectRoute, requireAdmin)
router.post("/", createPlatform);

//UPDATE Platform (Admin) (protectRoute, requireAdmin)
router.put(("/:id"), updatePlatform);

//DELETE Platform (Admin) (protectRoute, requireAdmin)
router.delete(("/:id"), deletePlatform);

export default router;