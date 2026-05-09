import express from "express";
import { getAllGenres, getGenreOptions, createGenre, updateGenre, toggleGenreStatus } from "../controllers/genre.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Genres for Admin EJ: GET /api/genres?page=1&limit=10&search=RPG&is_active=true
router.get("/", protectRoute, requireAdmin, getAllGenres);

//READ Genres for Users
router.get("/options", getGenreOptions);

//CREATE Genres (Admin) (protectRoute, requireAdmin)
router.post("/", protectRoute, requireAdmin, createGenre);

//UPDATE Genres (Admin) (protectRoute, requireAdmin)
router.put(("/:id"), protectRoute, requireAdmin, updateGenre);

//PATCH Genres (Admin) (protectRoute, requireAdmin)
router.patch(("/:id/toggle"), protectRoute, requireAdmin, toggleGenreStatus);

export default router;