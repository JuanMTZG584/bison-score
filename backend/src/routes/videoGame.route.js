import express from "express";
import { getAllVideoGames, getVideoGameOptions, getVideoGameDetails, createVideoGame, updateVideoGame, toggleVideoGameStatus } from "../controllers/videoGame.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

//READ Videogames for Admins EJ: GET /api/videogames/?page=1&limit=5&search=halo&is_active=true&platform_id=681a72c4f0d9f1c8a5e3b123
// (protectRoute, requiereAdmin)
router.get("/", getAllVideoGames);

//READ Videogames list for users EJ: GET /api/videogames/options?search=halo&platform_id=[...]&genre_id=[...]&page=1&limit=10
router.get("/options", getVideoGameOptions);

//READ Videogames details for users
router.get("/:id", getVideoGameDetails);

//CREATE Videgame (Admin) (protectRoute, requireAdmin)
router.post("/", createVideoGame);

//UPDATE Videogame (Admin) (protectRoute, requireAdmin)
router.put("/:id", updateVideoGame);

//PATCH Videogame (Admin) (protectRoute, requireAdmin)
router.patch("/:id/toggle", toggleVideoGameStatus);

export default router;