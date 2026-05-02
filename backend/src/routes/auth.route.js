import express from "express";
import { signup, login, logout,getMe } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/signup",upload.single("image"), signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

// router.get("/check", protectRoute, (req, res) => {
//   res.status(200).json(req.user);
// });

export default router;
